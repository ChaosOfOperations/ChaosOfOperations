package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"path"
	"strings"
)

type StaticHandler struct {
	http.Dir
}

func serveStaticFilesOr404(responseWriter http.ResponseWriter, request *http.Request) {
	staticHandler := StaticHandler{http.Dir(webRoot)}
	staticHandler.ServeHttp(responseWriter, request)
}

func serve404OnErr(err error, responseWriter http.ResponseWriter) bool {
	if err != nil {
		serve404(responseWriter)
		return true
	}
	return false
}

func serve404(responseWriter http.ResponseWriter) {
	responseWriter.WriteHeader(http.StatusNotFound)
	template, err := ioutil.ReadFile(webRoot + "/error-templates/404.html")
	if err != nil {
		template = []byte("Error 404 - Page Not Found. Additionally a 404 page template could not be found.")
	}
	fmt.Fprint(responseWriter, string(template))
}

func (sh *StaticHandler) ServeHttp(responseWriter http.ResponseWriter, request *http.Request) {
	staticFilePath := staticFilePath(request)

	fileHandle, error := sh.Open(staticFilePath)
	if serve404OnErr(error, responseWriter) {
		return
	}
	defer fileHandle.Close()

	fileInfo, error := fileHandle.Stat()
	if serve404OnErr(error, responseWriter) {
		return
	}

	if fileInfo.IsDir() {
		if request.URL.Path[len(request.URL.Path)-1] != '/' {
			http.Redirect(responseWriter, request, request.URL.Path+"/", http.StatusFound)
			return
		}

		fileHandle, error = sh.Open(staticFilePath + "/index.html")
		if serve404OnErr(error, responseWriter) {
			return
		}
		defer fileHandle.Close()

		fileInfo, error = fileHandle.Stat()
		if serve404OnErr(error, responseWriter) {
			return
		}
	}

	http.ServeContent(responseWriter, request, fileInfo.Name(), fileInfo.ModTime(), fileHandle)
}

func staticFilePath(request *http.Request) string {
	staticFilePath := request.URL.Path
	if !strings.HasPrefix(staticFilePath, "/") {
		staticFilePath = "/" + staticFilePath
		request.URL.Path = staticFilePath
	}
	return path.Clean(staticFilePath)
}

func panicOnError(error error) {
	if error != nil {
		log.Panic(error)
	}
}

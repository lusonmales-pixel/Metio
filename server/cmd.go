package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

var KEY = os.Getenv("API")

var lat, lon float64

type City struct {
	City string `json:"city"`
}

type WeatherResponse struct {
	Weather   string  `json:"weather"`
	Desc      string  `json:"desc"`
	Temp      float64 `json:"temp"`
	WindSpeed float64 `json:"wind_speed"`
}

type LatLon struct {
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
}

type OWResponse struct {
	Specs       []OWSpecs `json:"weather"`
	MainWeather OWMain    `json:"main"`
	Wind        OWWind    `json:"wind"`
}

type OWMain struct {
	Temp     float64 `json:"temp"`
	Pressure float64 `json:"pressure"`
}

type OWWind struct {
	WindSpeed float64 `json:"speed"`
}

type OWSpecs struct {
	MainSpec    string `json:"main"`
	Description string `json:"description"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Ошибка загрузки файла .env")
	}

	http.HandleFunc("/getLanLon", GetLatLon)
	http.HandleFunc("/getWeather", GetMeteoData)

	err = http.ListenAndServe(":8090", nil)
	if err != nil {
		fmt.Println("Failed to start server: ", err)
		return
	}
}

func GetLatLon(w http.ResponseWriter, r *http.Request) {
	var CityReq City

	httpRequestBody, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Failed to get request body!")
		return
	}

	err = json.Unmarshal(httpRequestBody, &CityReq)
	if err != nil {
		fmt.Println("Failed to unmarshal request body!")
		return
	}

	resp, err := http.Get(fmt.Sprintf("http://api.openweathermap.org/geo/1.0/direct?q=%s&limit=5&appid=%s", CityReq.City, KEY))
	if err != nil {
		fmt.Println("Failed to get body!")
		return
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to get body!")
		return
	}

	var LatLons []LatLon

	err = json.Unmarshal(body, &LatLons)
	if err != nil {
		fmt.Println("Failed to unmarshal body!")
	}

	for _, location := range LatLons {
		lat = location.Lat
		lon = location.Lon
	}

	ResponseBody, err := json.Marshal(LatLon{Lat: lat, Lon: lon})
	if err != nil {
		fmt.Println("Failed to make response body!")
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(ResponseBody)
}

func GetMeteoData(w http.ResponseWriter, r *http.Request) {
	GetLatLon := LatLon{}

	httpRequestBody, err := io.ReadAll(r.Body)
	if err != nil {
		fmt.Println("Failed to get body!")
		return
	}

	err = json.Unmarshal(httpRequestBody, &GetLatLon)
	if err != nil {
		fmt.Println("Failed to unmarshal body!")
		return
	}

	resp, err := http.Get(fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?lat=%f&lon=%f&appid=%s", GetLatLon.Lat, GetLatLon.Lon, KEY))
	if err != nil {
		fmt.Println("Failed to get response from service!")
		return
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to get body!")
		return
	}

	var WeatherData OWResponse

	err = json.Unmarshal(body, &WeatherData)
	if err != nil {
		fmt.Println("Failed to unmarshal body!")
		return
	}

	ResponseBody, err := json.Marshal(WeatherResponse{
		Weather:   WeatherData.Specs[0].MainSpec,
		Desc:      WeatherData.Specs[0].Description,
		Temp:      WeatherData.MainWeather.Temp,
		WindSpeed: WeatherData.Wind.WindSpeed,
	})

	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(ResponseBody)
}

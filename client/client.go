package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type City struct {
	City string `json:"city"`
}

type WeatherResponse struct {
	Weather   string  `json:"weather"`
	Desc      string  `json:"desc"`
	Temp      float64 `json:"temp"`
	WindSpeed float64 `json:"wind_speed"`
}

func main() {
	var CityNameCLI string
	fmt.Println("Введите называние города(на английском): ")
	fmt.Scan(&CityNameCLI)

	body, err := json.Marshal(City{City: CityNameCLI})
	if err != nil {
		fmt.Println("Failed to make request body!")
		return
	}

	LatLonReq, err := http.NewRequest("GET", "http://localhost:8090/getLanLon", bytes.NewBuffer(body))
	if err != nil {
		fmt.Println("Failed to make Request!")
		return
	}

	LatLonReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(LatLonReq)
	if err != nil {
		fmt.Println("Failed to get response!")
		return
	}

	defer resp.Body.Close()

	bodyLatLon, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Failed to get body!")
		return
	}

	WeatherReq, err := http.NewRequest("GET", "http://localhost:8090/getWeather", bytes.NewBuffer(bodyLatLon))
	if err != nil {
		fmt.Println("Failed to create request!")
		return
	}

	WeatherReq.Header.Set("Content-Type", "application/json")

	WeatherResp, err := client.Do(WeatherReq)
	if err != nil {
		fmt.Println("Failed to get weather resp!")
		return
	}

	defer WeatherResp.Body.Close()

	bodyWeather, err := io.ReadAll(WeatherResp.Body)
	if err != nil {
		fmt.Println("Failed to read body bytes!")
		return
	}

	var Weather WeatherResponse

	err = json.Unmarshal(bodyWeather, &Weather)
	if err != nil {
		fmt.Println("Failed to unmarshal final body!")
		return
	}

	tempC := Weather.Temp - 273.15

	fmt.Printf(
		"Погода: %s\n"+
			"Описание: %s\n"+
			"Температура: %.1f °C\n"+
			"Ветер: %.1f м/с\n",
		Weather.Weather,
		Weather.Desc,
		tempC,
		Weather.WindSpeed,
	)

}

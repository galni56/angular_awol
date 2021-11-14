import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { WeatherService } from '../../service/weather.service';

@Component({
  selector: 'app-weather-location',
  templateUrl: './weather-location.component.html',
  styleUrls: ['./weather-location.component.css']
})
export class WeatherLocationComponent implements OnInit {
  public location = new FormControl();
  public locationsList = [];
  public day1;
  public day2;
  public day3;
  public day4;
  public day5;
  public weatherDesc;
  public mainWeather;
  public wind;
  public pressure;
  public temperature;
  public showData = false;
  locationGroup = new FormGroup({
    location: new FormControl()
  })

  constructor(private service: WeatherService) { }

  ngOnInit() {
  }

  onSubmit(locationValue, isPush){
    let selectedLocation = locationValue;
    this.service.searchWeatherData(selectedLocation).subscribe( success => {
      this.showData = true;
      this.weatherDesc = success.weather[0].description;
      this.mainWeather = success.weather[0].main;
      this.wind = success.wind.speed + 'ms  ' + success.wind.deg +' deg';
      this.pressure = success.main.pressure;
      this.temperature = (success.main.temp - 273.15).toFixed(1);
      if(isPush) {
        let appendedData = ' - ' + this.temperature + 'C ' + this.mainWeather;
        let selectedLocationData = {};
        selectedLocationData['location'] = selectedLocation;
        selectedLocationData['data'] = appendedData;
        this.locationsList.push(selectedLocationData);
      }
      let latitude = success.coord.lat;
      let longitude = success.coord.lon;
      for(let i = 0; i < 5; i++ ){
        this.service.getWeeklyData(latitude, longitude, i).subscribe( res => {
          let spanId = 'day'+i;
          res['current'].temp;
          document.getElementById(spanId).innerHTML = (res['current'].temp - 273.15).toFixed(1)+ ' C';
        });
      }

    }, error => {

      alert("Please enter the valid location");
    });
  }

  selectedLocation(location) {
    console.log("location", location);
    this.onSubmit(location, false);
  }

  clearWeatherData(){
    this.locationsList = [];
    this.showData = false;
  }

}

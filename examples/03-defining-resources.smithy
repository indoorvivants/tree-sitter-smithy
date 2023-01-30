$version: "2"
namespace example.weather

/// Provides weather forecasts.
service Weather {
    version: "2006-03-01"
    resources: [City]
}

// "pattern" is a trait.
@pattern("^[A-Za-z0-9 ]+$")
string CityId

resource City {
    identifiers: { cityId: CityId }
    properties: { coordinates: CityCoordinates }
    read: GetCity
    resources: [Forecast]
}

structure GetCityOutput for City {
    $coordinates
}

resource Forecast {
    identifiers: { cityId: CityId }
    properties: { chanceOfRain: Float }
    read: GetForecast
}

structure GetForecastOutput for Forecast {
    $chanceOfRain
}

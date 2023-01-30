$version: "2"
namespace example.weather

@readonly
operation GetCity {
    input: GetCityInput
    output: GetCityOutput
    errors: [NoSuchResource]
}

@input
structure GetCityInput for City {
    // "cityId" provides the identifier for the resource and
    // has to be marked as required.
    @required
    $cityId
}

@output
structure GetCityOutput {
    // "required" is used on output to indicate if the service
    // will always provide a value for the member.
    @required
    @notProperty
    name: String

    @required
    $coordinates
}

structure CityCoordinates {
    @required
    latitude: Float

    @required
    longitude: Float
}

// "error" is a trait that is used to specialize
// a structure as an error.
@error("client")
structure NoSuchResource {
    @required
    resourceType: String
}

@readonly
operation GetForecast {
    input: GetForecastInput
    output: GetForecastOutput
}

// "cityId" provides the only identifier for the resource since
// a Forecast doesn't have its own.
@input
structure GetForecastInput {
    @required
    cityId: CityId
}

@output
structure GetForecastOutput {
    chanceOfRain: Float
}

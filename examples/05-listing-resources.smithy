$version: "2"
namespace example.weather

/// Provides weather forecasts.
@paginated(inputToken: "nextToken", outputToken: "nextToken",
           pageSize: "pageSize")
service Weather {
    version: "2006-03-01"
    resources: [City]
}

// The paginated trait indicates that the operation may
// return truncated results. Applying this trait to the service
// sets default pagination configuration settings on each operation.
@paginated(items: "items")
@readonly
operation ListCities {
    input: ListCitiesInput
    output: ListCitiesOutput
}

@input
structure ListCitiesInput {
    nextToken: String
    pageSize: Integer
}

@output
structure ListCitiesOutput {
    nextToken: String

    @required
    items: CitySummaries
}

// CitySummaries is a list of CitySummary structures.
list CitySummaries {
    member: CitySummary
}

// CitySummary contains a reference to a City.
@references([{resource: City}])
structure CitySummary {
    @required
    cityId: CityId

    @required
    name: String
}

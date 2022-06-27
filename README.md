# Software effort estimator

"Effort-estimator" is an extension that facilitates the estimation of human effort needed to complete a software development project.

## Features

The extension uses 5 project-specific attributes, namely:

* lenght of the project, measured in months
* number of entities in the data model
* number of logical transactions in the system
* size of the project measured in adjusted function points
* size of the project measured in non-adjusted function points

which must be given by the user, either manually or by uploading a .csv file.

After the data was provided, the extension will validate it and notify the user if there are any irregularities found through a popup message. If valid data was provided, the server is called, the side panel is automatically opened and real-time populated with the response received from the server.

This extension provides the following commands:

* `Effort estimation: Estimate effort`, which opens the graphics panel of the extension
* `Effort estimation: : Refresh side panel`, which refreshes the side panel of the extension
* `Effort estimation: : Refresh graphics panel`, which refreshes the graphics panel of the extension

> Note: The extension will not perform the prediction by itself yet, the user must clone and locally run the server mentioned in the Requirements section.

## Requirements

For now, the extension uses a local server, which can be found [here](https://github.com/ioanachelaru/effort-estimator-server) and which requires the following packages in order to run:

```
Flask==2.1.2
gunicorn==20.1.0
numpy==1.22.3
pandas==1.4.2
scikit_learn==1.1.1
keras==2.9.0
scikeras==0.8.0
tensorflow==2.9.0
```

## Known Issues

This is a demo extension, it will not work in production mode since the server side has not been successfully deployed.

## Release Notes

### 0.0.1

Initial release of the Software effort estimator. It includes the effort estimation measured in human-hours based on the manually inputted data.

const path=require('path')
const express=require('express')
const hbs=require('hbs')
const geocode=require('./utils/geocode')
const forecast=require('./utils/forecast') 

const app=express()
const port=process.env.PORT || 3000

// Define paths for Express configuration
const publicDirectoryPath=path.join(__dirname, '../public') // generates the path to the public folder
const viewsPath=path.join(__dirname, '../templates/views')
const partialsPath=path.join(__dirname, '../templates/partials')

// Set handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath)) // provide it to static which configures the express app

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Serop Kelkelian'
    }) // express goes and gets the view converts to html and makes sure it goes back to requester
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Ur gay',
        name: 'Serop Kelkelian'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'You are a homosexual',
        name: 'Serop Kelkelian'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send(error)
            }
    
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    }) 
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help 404 Page',
        errorMessage: 'Help article not found',
        name: 'Serop Kelkelian'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'My 404 Page',
        errorMessage: 'Page not found',
        name: 'Serop Kelkelian'
    })
})

app.listen(port, () => { // starts the server up
    console.log('Server is up on port ' + port) // tells the coder that the port is up
})

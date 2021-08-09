const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Category = require('./Models/Category')
const Movie = require('./Models/Movie')

const uri = 'mongodb://localhost:27017/test'
// MongoDB Connect 
MongoDBConnection = async () => {
    try {
        await mongoose.connect(uri, {
            useCreateIndex: true,
            useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'console error:'))
        db.once('open', () => {
            console.log("MongoDB connected local");
        })

    } catch (err) {
        throw err
    }
}
MongoDBConnection()

app.use(express.urlencoded({
    extended: true
}))

app.get('/', (req, res, next) => {
    res.send('Hello express')
})

//  >>>>>>>>>>>>>>>>>>>>>>>>category 
app.post('/add/category', async (req, res, next) => {
    const { typeCategory } = req.body
    const newCategory = new Category({
        typeCategory
    })

    res.json(typeCategory)
    await newCategory.save()
})

app.get('/categories', async (req, res, next) => {
    const categories = await Category.find()
    res.json(categories)
})

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> movies

app.post('/add/movie', async (req, res, next) => {
    const { title, imdb, directedYear, categoryId } = req.body

    const newMovie = new Movie({
        title,
        imdb,
        directedYear,
        categoryId
    })

    res.json(req.body)
    await newMovie.save()
})

app.get('/category/:id', async (req, res, next) => {
    const movie = await Category.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.params.id)
            }
        },
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: "categoryId",
                as: "movies"
            }
        },
        {
            $unwind: {
                path: "$movies",
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id'
                },
                movies: {
                    $push: "$movies"
                }
            }
        }
    ])

    res.json(movie)
})

app.get('/movies', async (req, res, next) => {
    const movies = await Movie.find()
    res.json(movies)
})


app.get('/movies/top', async (req, res, next) => {
    const movies = await Movie.find().sort({ imdb: -1 }).limit(3)
    res.json(movies)
})


app.get('/between/:start/:end', async (req, res, next) => {
    const { start, end } = req.params
    const movies = await Movie.find(  // gte >= || lte <=
        { directedYear: { $gte: parseInt(start), $lte: parseInt(end) } }
    )
    res.json(movies)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Express working on port ${port}`);
})

/* TZ ===>
app =>  get('/') =>> hello
app =>  post(/add/category) // categoriya yaratish
app =>  get(/category)
app =>  post(/add/movie)
app =>  get(category/:id)// lookup, match, unwind, gruop
app =>  get(/movies)
app =>  get(/top) // sort / limit
app =>  get(/between/:start/:end) / $gte $lte
*/
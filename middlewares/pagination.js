function paginatedResults(model){
    return(req,res,next) => {
        const page = parseInt(req.body.pages)
        const limit = parseInt(req.body.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if(startIndex < 0){
            results.previous = {
                page: page - 1,
                limit:limit
            }
        }

        if(endIndex >= model.length){
            results.next = {
                page: page + 1,
                limit:limit
            }
        }
        try{
            results.results = model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        }
        catch(err){
            res.status(500).json({message:err.message})
        }
        
    }

}

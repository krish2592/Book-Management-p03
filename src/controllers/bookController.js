const bookModel = require("../models/bookModel");
const { isValidRequestBody, isValid,isValidDate, isValidEnum, isValidName, isValidMobile, isValidEmail, isValidPassword, isValidISBN } = require("../utilities/validator");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const { isValidObjectId } = require("mongoose");

//--Register User
const createBook = async function (req, res) {
    try {
        let requestBody = req.body

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Invalid request, please provide details" })

        let {title,excerpt ,userId, ISBN,category,subcategory,reviews,deletedAt,isDeleted, releasedAt } = requestBody

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "Title is a mendatory field" })
        let isUniqueTitle = await bookModel.findOne({ title: title})
        if (isUniqueTitle) return res.status(400).send({ status: false, msg: `${title} is already exist` })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, msg: "Excerpt is a mendatory field" })
        if (!isValid(userId)) return res.status(400).send({ status: false, msg: "UserId is a mendatory field" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: `${userId}  is not a valid` })
        let isUniqueUserId= await userModel.findOne({ _id: userId})
        if(!isUniqueUserId)return res.status(404).send({status:false, msg:"User not found"})

        

        if (!isValid(ISBN)) return res.status(400).send({ status: false, msg: "ISBN is a mendatory field" })
        if(!isValidISBN(ISBN)) return res.status(400).send({ status: false, msg: "ISBN is invalid " })
        let isUniqueISBN= await bookModel.findOne({ ISBN: ISBN})
        if (isUniqueISBN) return res.status(400).send({ status: false, msg: `${ISBN} is already exist` })

        
        if (!isValid(category)) return res.status(400).send({ status: false, msg: "category is a mendatory field" })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, msg: "subcategory is a mendatory field" })

        if(!isValid(releasedAt))return res.status(400).send({status:false,msg:"releasedAt is mandatory field"})
        if(!isValidDate(releasedAt))return res.status(400).send({status:false,msg:"Please provide date in YYYY-MM-DD format"})
              
        const bookData = { title,excerpt ,userId, ISBN,category,reviews,subcategory,deletedAt,isDeleted, releasedAt } ;
        const saveBook = await bookModel.create(bookData)

        return res.status(201).send({ status: true, message: "Sucess", data: saveBook })

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }

}
module.exports={createBook}
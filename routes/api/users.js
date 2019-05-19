const express = require('express');
const router = express.Router();

// @route   api/user
// @access  Public
router.get('/',(req,res)=>{
    res.send("User page");
});

module.exports= router;
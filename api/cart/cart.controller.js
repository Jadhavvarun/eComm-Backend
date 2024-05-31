const { getData, insert } = require("./cart.service");

module.exports = {

    gerDataController: function (req, res) {
        const c_id = req.params.c_id;
        getData(c_id, (err, result) => {
           
                if (err) {
                    return res.status(500).json({
                        "status": "error",
                        "data": []
                    })
                } else {

                return res.status(200).json({
                    "status": "success",
                    "data": result
                });
            }
        })
    },
    insertController:(req,res)=>{
        const params = req.body;
        insert(params,(err,result)=>{
            if (err) {
                return res.status(500).json({
                    "status": "error",
                    "data": []
                })
            }

            return res.status(200).json({
                "status": "success",
                "data": result
            })
        })
    }
}
var request = {
    parseBody: function(body){
        if(body!=null)
        {
            return body;
        }
    },
    converToJson: function(str){
        return JSON.parse(str);
    }
}

module.exports = request;
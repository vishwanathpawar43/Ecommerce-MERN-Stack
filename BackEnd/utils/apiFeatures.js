export class ApiFeatures{
    constructor(query,queryStr)
    {
        this.query=query,
        this.queryStr=queryStr
    }

    search(){
        const keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            }
        }:{};


        this.query=this.query.find({...keyword});

        return this;
    }

    filter()
    {
        const queryCopy={...this.queryStr};

        const removeFields=["keyword","page","limit"];

        removeFields.forEach((key)=>{
            delete queryCopy[key];
        })

        let str=JSON.stringify(queryCopy);
        str=str.replace(/\b{gt|lt|gte|lte}\b/g,(key)=> `$${key}`);
        const obj=JSON.parse(str);
        this.query=this.query.find(obj);
        
        return this;
    }
    pagination(resultsPerPage){
        const currentPage=Number(this.queryStr.page) || 1;

        const pagesSkip=resultsPerPage*(currentPage-1);

        this.query=this.query.limit(resultsPerPage).skip(pagesSkip);

        return this;
    }
}
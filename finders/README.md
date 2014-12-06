CS461
=====

Final Project

Data Models
=====

For example inside ng-repeat, for segements, you would have:

 ng-repeat="item in segments"
    {{ item.cast_id }}

Cast = {
    id:int
    company:string,
    date:date,
    updated:date,
    segments:[]
}

Segment = {
    id:int
    cast_id:int,
    subject:string,
    start:int,
    end:int,
    comment:string,
    updated:date
}

Question = {
    id:int,
    type:string,
    text:string,
    updated:date,
    options:[]
}

Option = {
    id:int,
    question_id:int,
    text:string,
    updated:date
}


CS461
=====

Final Project

Data Models
=====

For example inside `ng-repeat`, for `segements`, you would have:
```
<div ng-repeat="item in segments">
    <span class="thisIsHidden">{{ item.cast_id }}</span>
    <span class="thisIsVisible"> {{ item.subject }} </span>
</div>
```

`About start and end:` I will write a function that converts int (seconds) to a time break. As an example, 0 means time 0, whereas 30 means 0min 30 sec, and finally, 90 means 1min 30sec. You can do it too since the int is representing time in seconds.

`About date:` Simply use Javascripts datetime parser to convert the date into a format you want to show. [Read this if you want a jump start]

```
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
    section:int
    options:[]
}

Option = {
    id:int,
    question_id:int,
    text:string,
    updated:date
}
```

[Read this if you want a jump start]: http://jacwright.com/projects/javascript/date_format/

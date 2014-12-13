from finders.models import ser

class QuestionAnswers:

    @property
    def serialize(self):
       return {
           'id': self.id,
           'type' : self.type,
           'text' : self.text,
           'section': self.section,
           'options': self.serialize_many2many,
           'answer': self.answer.serialize,
           'updated': ser.dump_datetime(self.updated)
       }

    @property
    def serialize_many2many(self):
       return [ item.serialize for item in self.options]

class QuestionAnswersValue:

    @property
    def serialize(self):
        return {
           'id': self.id,
           'answer' : self.answer
       }

class QuestionAnswersOption:

    @property
    def serialize(self):
       return {
           'id': self.id,
           'question_id' : self.question_id,
           'text' : self.text,
           'checked' : self.checked,
           'updated' : ser.dump_datetime(self.updated)
       }

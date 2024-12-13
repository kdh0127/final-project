from .auth import auth_blueprint
from .predict import predict_blueprint
from .qa import qa_blueprint
from .cors import cors_blueprint


# 필요한 경우 블루프린트 리스트를 제공할 수 있음
blueprints = [
    auth_blueprint,
    predict_blueprint,
    qa_blueprint,  
    cors_blueprint,

]

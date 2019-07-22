from geonature.utils.env import DB
from sqlalchemy import ForeignKey
from sqlalchemy.sql import func
from geonature.utils.utilssqlalchemy import serializable, geoserializable
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry

from pypnnomenclature.models import TNomenclatures
from pypnusershub.db.models import User

@serializable
class TValidationsCol(DB.Model):
    __tablename__ = "t_vote_validation"
    __table_args__ = {"schema": "gn_module_validation_col"}

    id_vote_validation = DB.Column(DB.Integer, primary_key=True)
    uuid_attached_row = DB.Column(UUID(as_uuid=True))
    id_nomenclature_valid_status = DB.Column(DB.Integer)
    id_validator = DB.Column(DB.Integer)
    date_vote = DB.Column(DB.DateTime, server_default=func.now())
    validation_label = DB.relationship(
        TNomenclatures,
        primaryjoin=(TNomenclatures.id_nomenclature == id_nomenclature_valid_status),
        foreign_keys=[id_nomenclature_valid_status],
    )
    validator_role = DB.relationship(
        User, primaryjoin=(User.id_role == id_validator), foreign_keys=[id_validator]
    )




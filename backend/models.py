from geonature.utils.env import DB
from sqlalchemy import ForeignKey
from sqlalchemy.sql import func
from geonature.utils.utilssqlalchemy import serializable, geoserializable
from sqlalchemy.dialects.postgresql import UUID
from geoalchemy2 import Geometry

from pypnnomenclature.models import TNomenclatures
from pypnusershub.db.models import User

from geonature.core.gn_synthese.models import SyntheseOneRecord, Synthese, VSyntheseDecodeNomenclatures

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

class RecordValidation():
    def __init__(self,id_synthese):
        self.id_synthese = id_synthese
        self.uuid = DB.session.query(Synthese.unique_id_sinp).filter(Synthese.id_synthese == int(id_synthese)
        )
        
    def getFullRecord(self):
        q = (
            DB.session.query(SyntheseOneRecord)
            .filter(SyntheseOneRecord.id_synthese==self.id_synthese)
        )
        return q.one().as_geofeature(geoCol='the_geom_4326',idCol='id_synthese',recursif=True)
    
    def vote(self,statut,id_validator):
        try :
            addValidation = TValidationsCol(
                uuid_attached_row = self.uuid,
                id_nomenclature_valid_status = statut,
                id_validator = id_validator
            )
            DB.session.add(addValidation)
            DB.session.commit()
            DB.session.close()
            return True
        except InternalError as e:
            return False


import logging
from flask import Blueprint, current_app, request

from operator import itemgetter

import pdb

import re

from sqlalchemy import select, desc, cast, DATE, func

import datetime

from geojson import FeatureCollection

from geonature.utils.utilssqlalchemy import json_resp

from geonature.core.gn_meta.models import TDatasets

from geonature.core.gn_synthese.models import (
    Synthese,
    TSources,
    VMTaxonsSyntheseAutocomplete,
    VSyntheseForWebApp,
)

from geonature.core.gn_commons.models import BibTablesLocation

from .models import TValidationsCol

from geonature.utils.env import DB

from geonature.core.gn_permissions import decorators as permissions
from geonature.core.gn_commons.models import TValidations


# from geonature.core.gn_synthese.utils import query as synthese_query

from pypnnomenclature.models import TNomenclatures, BibNomenclaturesTypes

blueprint = Blueprint("validation_col", __name__)
log = logging.getLogger()

@blueprint.route("/", methods=["GET"])
def index():
    return 'hello'

@blueprint.route("/<id_synthese>", methods=["POST"])
@permissions.check_cruved_scope("C", True, module_code="VALIDATION_COL")
@json_resp
def post_status_vote(info_role, id_synthese):
    data = dict(request.get_json())
    id_validation_status = data["statut"]
    validation_comment = data["comment"]
    
    if id_validation_status == "":
        return "Aucun statut de validation n'est sélectionné", 400
    
    uuid = DB.session.query(Synthese.unique_id_sinp).filter(
        Synthese.id_synthese == int(id_synthese)
    )
    id_validator = info_role.id_role

    addValidation = TValidationsCol(
        uuid_attached_row = uuid,
        id_nomenclature_valid_status = id_validation_status,
        id_validator = id_validator
    )
    
    DB.session.add(addValidation)
    DB.session.commit()
    DB.session.close()
    
    return data





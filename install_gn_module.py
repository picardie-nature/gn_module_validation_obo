import subprocess
from pathlib import Path
import os
ROOT_DIR = Path(__file__).absolute().parent



def gnmodule_install_app(gn_db, gn_app):
    with gn_app.app_context() :
        table_sql = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data/validation_obo.sql')
        gn_db.session.execute(open(table_sql, 'r').read())
        gn_db.session.commit()
    except Exception as e:
        print(e)

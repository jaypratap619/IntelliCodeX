from flask import Blueprint, request, jsonify
from app.db import get_db_connection
import datetime
import uuid
import shutil
project_bp = Blueprint("project", __name__)


print('project_bp', project_bp)

# CREATE ROUTE
@project_bp.route("/create", methods=["POST"])
def createProject():
    data = request.get_json()
    print("data", data)
    project_name = data.get("projectName")
    project_type = data.get("projectType")
    project_id = str(uuid.uuid4())
    print("project_id", type(project_id))
    template_path = f"D:/MyProject/IntelliCodeX/backend/app/routes/templates/{project_type}"
    workspace_path = f"D:/MyProject/IntelliCodeX/backend/app/routes/workspaces/{project_id}"
    print("template_path", template_path)
    print("workspace_path", workspace_path)
    shutil.copytree(template_path, workspace_path)
    # Optionally insert project entry into DB here

    return jsonify({"project_id": project_id, "name": project_name, "type": project_type})

import os

@project_bp.route("/get_project/<project_id>/files", methods=["GET"])
def get_project_files(project_id):
    base_path = f"D:/MyProject/IntelliCodeX/backend/app/routes/workspaces/{project_id}"

    file_tree = {}
    
    for root, dirs, files in os.walk(base_path):
        for filename in files:
            filepath = os.path.join(root, filename)
            relative_path = os.path.relpath(filepath, base_path)
            with open(filepath, "r", encoding="utf-8") as f:
                file_tree[relative_path] = f.read()

    return jsonify({"files": file_tree})


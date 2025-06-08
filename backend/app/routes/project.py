from flask import Blueprint, request, jsonify
from app.db import get_db_connection
import datetime
import uuid
import shutil
import os

project_bp = Blueprint("projects", __name__)

print('project_bp', project_bp)

base_dir = os.path.dirname(os.path.abspath(__file__))

# CREATE ROUTE
@project_bp.route("/create", methods=["POST"])
def createProject():
    data = request.get_json()
    print("data", data)
    project_name = data.get("projectName")
    project_type = data.get("projectType")
    project_id = str(uuid.uuid4())
    print("project_id", type(project_id))
    template_path = f"{base_dir}/templates/{project_type}"
    workspace_path = f"{base_dir}/workspaces/{project_id}"
    print("template_path", template_path)
    print("workspace_path", workspace_path)
    shutil.copytree(template_path, workspace_path)
    # Optionally insert project entry into DB here

    return jsonify({"project_id": project_id, "project_name": project_name, "project_type": project_type})


def createFileStructure(path):
    root = os.listdir(path)
    file_tree = {}
    for entry in root:
        full_path = os.path.join(path, entry)
        if os.path.isdir(full_path):
            file_tree[entry] = createFileStructure(full_path)
        else:
            try:
                with open(full_path, "r", encoding="utf-8") as f:
                    file_tree[entry] = f.read()
            except:
                file_tree[entry] = "Error OPening file"
    return file_tree

@project_bp.route("/<project_id>", methods=["GET"])
def get_project_files(project_id):
    base_path = f"{base_dir}/workspaces/{project_id}"
    file_tree = createFileStructure(base_path)
    print("file_tree", file_tree)   
    return jsonify({"root": file_tree})


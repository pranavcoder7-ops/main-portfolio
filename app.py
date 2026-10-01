from flask import Flask, request, jsonify, send_from_directory
import mysql.connector

app = Flask(__name__)


# =========================
# MYSQL CONNECTION
# =========================

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="pranav@1234",
        database="portfolio_db"
    )


# =========================
# HOME PAGE
# =========================

@app.route("/")
def home():
    return send_from_directory(".", "index.html")


# =========================
# STATIC FILES
# =========================

@app.route("/<path:filename>")
def files(filename):
    return send_from_directory(".", filename)


# =========================
# CONTACT FORM
# =========================

@app.route("/contact", methods=["POST"])
def contact():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No data received."
            }), 400


        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()


        # =========================
        # VALIDATION
        # =========================

        if not name or not email or not message:

            return jsonify({
                "success": False,
                "message": "Please fill all fields."
            }), 400


        # =========================
        # DATABASE CONNECTION
        # =========================

        connection = get_db_connection()

        cursor = connection.cursor()


        # =========================
        # INSERT DATA
        # =========================

        query = """
            INSERT INTO contact_messages
            (name, email, message)
            VALUES (%s, %s, %s)
        """


        cursor.execute(
            query,
            (name, email, message)
        )


        connection.commit()


        # =========================
        # CLOSE DATABASE
        # =========================

        cursor.close()
        connection.close()


        # =========================
        # SUCCESS
        # =========================

        return jsonify({
            "success": True,
            "message": "Message saved successfully!"
        })


    except Exception as e:

        print("Database error:", e)

        return jsonify({
            "success": False,
            "message": "Database error occurred."
        }), 500


# =========================
# RUN FLASK
# =========================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
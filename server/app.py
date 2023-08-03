#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response, session, jsonify, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restful import Resource
from functools import wraps
import ipdb



# Local imports
from config import *
from models import User, Product, Review, Cartitem

# Views go here!
# @app.route('/')
# def home():
#     return 'welcome to the home page'

@app.route('/')
@app.route('/cartitems')
@app.route('/cartitems/<int:id>')
@app.route('/signin')
@app.route('/signup')
@app.route('/about')
@app.route('/home')
@app.route('/products/<int:id>')
@app.route('/products')
def index(id=0):
    return render_template("index.html")

def login_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        product_owner = session.get('user_id')
        prdouct_to_delete = db.session.get(Product, kwargs)
        if not session['user_id'] or product_owner != prdouct_to_delete.user_id:
            return make_response({'error': 'Unauthorized'}, 401)
        return func(*args, **kwargs)
    return decorated_function

class SignUp(Resource):
    
    def post(self):
        email = request.get_json()['email']
        username = request.get_json()['username']
        password = request.get_json()['password']
    
        if user := User.query.filter_by(username= username).first():
            return make_response('That user already exists. Try logging in')
    
        new_user = User(email=email, username=username, password=generate_password_hash(password, method='scrypt'))
        
        db.session.add(new_user)
        db.session.commit()

        session['user_id'] = new_user.id

        return make_response('New owner created.')
        
api.add_resource(SignUp, '/signup')

class SignIn(Resource):
    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']
        
        existing_user = User.query.filter_by(username=username).first()
        
        if not existing_user or not check_password_hash(existing_user.password, password):
            return make_response('Username or password was incorrect. Please try again.', 404)
        
        session['user_id'] = existing_user.id
        return make_response(existing_user.to_dict())
        
api.add_resource(SignIn, '/signin')

class CheckSession(Resource):
    def get(self):
        if user := User.query.filter(User.id == session.get('user_id')).first():
            return user.to_dict()
        else:
            return make_response({'message': '401: Not Authorized'}, 401)

api.add_resource(CheckSession, '/check_session')

class SignOut(Resource):
    def delete(self):
        session['user_id'] = None
        return make_response({'message': '204: No Content'}, 204)

api.add_resource(SignOut, '/signout')

class Products(Resource):
    def get(self):
        product = [p.to_dict() for p in Product.query.all()]
        return make_response(product, 200)
    
    def post(self):
        try:
            data = request.get_json()
            product = Product(**data)
            db.session.add(product)
            db.session.commit()
            return make_response(product.to_dict(), 201)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)
        
api.add_resource(Products, '/api/v1/products')

class ProductsByID(Resource):
    def get(self, id):
        try:
            product = Product.query.get(id)
            return make_response(jsonify(product.to_dict()), 200)
        except Exception:
            return make_response(jsonify({"error": "product not found"}), 404)
    
    def patch(self, id):
        product_by_id = db.session.get(Product, id)
        if not product_by_id:
            return make_response({"error": "Product not found"}, 404)
        try:
            data = request.get_json()
            for key in data:
                setattr(product_by_id, key, data[key])
            db.session.commit()
            return make_response(product_by_id.to_dict(), 200)
        except Exception as e:
            return make_response({"errors": [str(e)]}, 400)
    
    def delete(self, id):
        try:
            product = db.session.get(Product, id)
            db.session.delete(product)
            db.session.commit()
            return make_response(jsonify({}), 204)
        except Exception:
            return make_response(jsonify({"errors": "Product not found"}), 404)
        
    
api.add_resource(ProductsByID, '/api/v1/products/<int:id>')


class Cartitems(Resource):
    def get(self):
        result = []
        user_id = session.get('user_id')  # Retrieve the logged-in user's ID
        query_result = (
            db.session.query(Cartitem, Product)
            .select_from(Cartitem)
            .join(Product, Product.id == Cartitem.product_id)
            .filter(Cartitem.user_id == user_id)  # Filter cart items by user ID
            .all()
        )
        for query in query_result:
            (cartitem, product) = query
            joined_product = {
                "id": cartitem.id,
                "product_id": product.id,
                "quantity": cartitem.quantity,
                "name": product.name,
                "image": product.image,
                "description": product.description,
                "price": product.price
            }
            result.append(joined_product)
            
        return make_response(jsonify(result), 200)
        
    def post(self):
        try:
            data = request.get_json()
            user_id = session.get('user_id')  # Retrieve the logged-in user's ID
            cart_item = Cartitem(user_id=user_id, **data)  # Set the user_id of the cart item
            db.session.add(cart_item)
            db.session.commit()
            return make_response(cart_item.to_dict(), 201)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)
        
api.add_resource(Cartitems, '/api/v1/cartitems')


class CartitemByID(Resource):
    def patch(self, id):
        item_by_id = db.session.get(Cartitem, id)
        if not item_by_id:
            return make_response({"error": "Item not found"}, 404)
        try:
            data = request.get_json()
            for key in data:
                setattr(item_by_id, key, data[key])
            db.session.commit()
            return make_response(item_by_id.to_dict(), 200)
        except Exception as e:
            return make_response({"errors": [str(e)]}, 400)
    
    def delete(self, id):
        try:
            item = db.session.get(Cartitem, id)
            db.session.delete(item)
            db.session.commit()
            return make_response(jsonify({}), 204)
        except Exception:
            return make_response(jsonify({"errors": "Item not found"}), 404)
        

api.add_resource(CartitemByID, '/api/v1/cartitems/<int:id>')

class Reviews(Resource):

    def get(self):
        review = [r.to_dict() for r in Review.query.all()]
        return make_response(jsonify(review), 200)
    
        
    def post(self):
        try:
            data = request.get_json()
            review = Review(**data)
            db.session.add(review)
            db.session.commit()
            return make_response(review.to_dict(), 201)
        except Exception as e:
            return make_response(jsonify({"errors": [str(e)]}), 400)
        
api.add_resource(Reviews, '/reviews')

class ReviewById(Resource):

    def delete(self, id):
        try:
            review = db.session.get(Review, id)
            db.session.delete(review)
            db.session.commit()
            return make_response(jsonify({}), 204)
        except Exception:
            return make_response(jsonify({"errors": "Review not found"}), 404)
        
api.add_resource(ReviewById, '/reviews/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
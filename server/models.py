from sqlalchemy_serializer import SerializerMixin

from config import *
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy


class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    reviews = db.relationship('Review', backref='user')
    cart_items = association_proxy('reviews', 'cart_items')
    
    
    def __repr__(self):
        return f'<User {self.id}: {self.username}'
    
    
class Cartitem(db.Model, SerializerMixin):
    __tablename__ = "cartitems"
    
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    product_id =  db.Column(db.Integer, db.ForeignKey('products.id'))
    user_id =  db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    
    
    
    def __repr__(self):
        return f'<Cartitem {self.id}'
    
    
class Product(db.Model, SerializerMixin):
    __tablename__ = "products"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    image = db.Column(db.String)
    category = db.Column(db.String)
    condition = db.Column(db.String)
    description = db.Column(db.String)
    price = db.Column(db.Float)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    reviews = db.relationship('Review', backref='product', cascade='all')
    
    serlize_only = (id, name, image, category, condition, description, price, reviews)
    
    @validates('name')
    def validate_name(self, key, name):
        if not 1 <= len(name) <= 30:
            raise ValueError('Name must be between 1 and 30 characters')
        return name
    
    @validates('category')
    def validate_category(self, key, category):
        if not category:
            raise ValueError('Category cannot be empty')
        return category
    
    @validates('conditon')
    def validate_condition(self, key, condition):
        if not condition:
            raise ValueError('Category cannot be empty')
        return condition
    
    
    
    def __repr__(self):
        return f'<Product {self.id}'
    
    
class Review(db.Model, SerializerMixin):
    __tablename__ = "reviews"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    body = db.Column(db.String)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    #product = db.relationship('Product', backref='review')
    #products = association_proxy('cart_items', 'product')
    
    serialize_only = ('id', 'user_id', 'body', 'product_id')
    
    def __repr__(self):
        return f'<Review {self.id}'
from django.contrib.auth.hashers import BCryptSHA256PasswordHasher
from django.utils.crypto import (
    constant_time_compare, get_random_string, pbkdf2,
)

class MyBCryptPasswordHasher(BCryptSHA256PasswordHasher):
	"""
	A subclass of PBKDF2PasswordHasher that uses 10 times more iterations.
	"""
	rounds = 10
	algorithm = "bcrypt"
	digest = None

	
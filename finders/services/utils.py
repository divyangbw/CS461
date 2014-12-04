import random, string

def generate_auth_token():
    new_token = ''.join(random.choice(string.ascii_lowercase) for x in range(128))
    return new_token
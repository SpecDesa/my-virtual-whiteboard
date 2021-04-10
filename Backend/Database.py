
class Database:
    '''Class that simulates a database.'''

    def __init__(self, admin, adminPsw):
        self.data: dict = {f'{admin}':  [adminPsw, True]}
        self.preferredName: dict = {f'{admin}': adminPsw}
        self.posts = [[['']]]

    def add(self, username, password, admin):
        '''Add a user with password and whether the user is a admin to the database.'''
        if self.data.get(username) is None:
            self.data[username] = [password, admin]
            self.preferredName[username] = username
            return True
        else:
            return False

    def print_users(self):
        '''Print users in database. Primarily for debugging.'''
        for user in self.data:
            print(user)

    def verify(self, username, password):
        '''Verify that username and password matches.'''
        if self.data.get(username) is not None:
            [psw, adm] = self.data[username]
            if psw == password:
                print('Password is correct')
                return True
            else:
                print('Password is not correct')
                return False
        else:
            print('User not found')
            return False

    def make_admin(self, myUsername, userToBecomeAdmin):
        '''Make user an admin.'''
        if self.data.get(myUsername) is not None and self.data.get(userToBecomeAdmin) is not None:
            [myPsw, myAdm] = self.data[myUsername]
            [psw, adm] = self.data[userToBecomeAdmin]
            if myAdm is True:
                self.data[userToBecomeAdmin] = [psw, True]
        else:
            print(
                f'{myUsername} is not an admin or {userToBecomeAdmin} is not found in database')

    def verify_admin(self, username):
        '''Verify that user is an admin.'''
        if self.data.get(username) is not None:
            x = self.data[username]
            [psw, adm] = self.data[username]
            # print('i get x?', x)
            print(f'The user "{username}" is administator? : {adm}')
            return True

    def get_preferred_name(self, username):
        '''Get preferred name of user. May not want it to be the username.'''
        if self.data.get(username) is not None:
            return self.preferredName[username]
        else:
            return None

    def set_preferred_name(self, username, password, newPreferredName):
        '''Set preferred name to something else than username.'''
        if self.verify(username, password):
            self.preferredName[username] = newPreferredName
            return True
        else:
            return False

    def reset_password(self, username, newPassword):
        '''Reset password with given password'''
        if self.data.get(username) is not None:
            [psw, admin] = self.data.get(username)
            self.data[username] = [newPassword, admin]
            return True
        else:
            return False

    def save_posts(self, posts):
        '''Save post for storing post on whiteboard until deleted.'''
        self.posts = posts

    def get_posts(self):
        '''Get posts that whiteboard have'''
        return self.posts

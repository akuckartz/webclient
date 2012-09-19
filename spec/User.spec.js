/*
 * Copyright 2012 Denis Washington <denisw@online.de>
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function(require) {
  var User = require('models/User');

  describe('User', function() {
    var user;

    beforeEach(function() {
      user = new User;
    });

    describe('login()', function() {
      it('should send authorized request to URL /subscribed', function() {
        spyOn($, 'ajax').andCallFake(function(options) {
          expect(options.url).toBe('https://example.com/subscribed');
          var auth = 'Basic ' + btoa('bob@example.com:bob');
          expect(options.headers['Authorization']).toBe(auth);
          expect(options.xhrFields.withCredentials).toBe(true);
        });
        user.credentials.set({username: 'bob@example.com', password: 'bob'});
        user.login();
        expect($.ajax).toHaveBeenCalled();
      });

      it('should not send request if user is anonymous', function() {
        spyOn($, 'ajax');
        user.login();
        expect($.ajax).not.toHaveBeenCalled();
      });

      it('should trigger "loginSuccess" on success response', function() {
        spyOn($, 'ajax').andCallFake(function(options) {
          options.success();
        });
        spyOn(user, 'trigger');
        user.credentials.set({username: 'bob@example.com', password: 'bob'});
        user.login();
        expect(user.trigger).toHaveBeenCalledWith('loginSuccess');
      });

      it('should trigger "loginSuccess" if user is anonymous', function() {
        spyOn(user, 'trigger');
        user.credentials.set({username: null, password: null});
        user.login();
        expect(user.trigger).toHaveBeenCalledWith('loginSuccess');
      });

      it('should trigger "loginError" on error response', function() {
        spyOn($, 'ajax').andCallFake(function(options) {
          options.error();
        });
        spyOn(user, 'trigger');

        user.credentials.set({username: 'bob@example.com', password: 'bob'});
        user.login();
        expect(user.trigger).toHaveBeenCalledWith('loginError');
      });
    });
  });

});

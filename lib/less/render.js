var PromiseConstructor;

module.exports = function(environment, ParseTree, ImportManager) {
    var render = function (input, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }

        if (!callback) {
            if (!PromiseConstructor) {
                PromiseConstructor = typeof Promise === 'undefined' ? require('promise') : Promise;
            }
            var selfThis = this;
            return new PromiseConstructor(function (resolve, reject) {
                render.call(selfThis, input, options, function(err, output) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(output);
                    }
                });
            });
        } else {
            this.parse(input, options, function(err, root, imports, options) {
                if (err) { return callback(err); }

                var result;
                try {
                    var parseTree = new ParseTree(root, imports);
                    result = parseTree.toCSS(options);
                }
                catch (err) { return callback(err); }

                callback(null, result);
            });
        }
    };

    return render;
};
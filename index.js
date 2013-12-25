var MiniOps = function(recordsToKeep, errorsToKeep) {
    this.recordsToKeep = recordsToKeep || 72;
    this.errorsToKeep = errorsToKeep || 100;

    this.upSince = new Date();
    this.recordings = [];
    this.errors = [];
}

MiniOps.prototype.findRecordingsByDate = function(date) {
    for (var i=0;i<this.recordings.length;i++) {
        if (this.recordings[i].date.getTime() == date.getTime()) {
            return this.recordings[i];
        }
    }
}

MiniOps.prototype.createHourResolutionDate = function() {
    var h = new Date();
    return new Date(h.getFullYear(), h.getMonth(), h.getDate(), h.getHours());
}

MiniOps.prototype.recorder = function() {
    var self = this;

    return function(req, res, route, error) {
        var date = self.createHourResolutionDate();

        var recording = self.findRecordingsByDate(date);

        if (!recording) {
            recording = { date : date, statistics : {} };
            self.recordings.push(recording);
        }

        var statusCode = res.statusCode;

        if (!recording.statistics[statusCode]) {
            recording.statistics[statusCode] = 0;
        }

        recording.statistics[statusCode]++;

        var statusCodeGroup = Math.floor(statusCode / 100) + 'xx';

        if (!recording.statistics[statusCodeGroup]) {
            recording.statistics[statusCodeGroup] = 0;
        }

        recording.statistics[statusCodeGroup]++;

        if(self.recordings.length > self.recordsToKeep) {
            self.recordings.shift();
        }

        if (error) {
            var error = { date: new Date(),  reason: error, url : req.url };

            if (route && route.spec) {
                error.path = route.spec.path;
                error.method = route.spec.method;
                error.params = route.params;
            }

            self.errors.push(error);

            if (self.errors.length > self.errorsToKeep) {
                self.errors.shift();
            }
        }
    }
}

MiniOps.prototype.dataHub = function() {
    var self = this;
    return function(req, res, next) {
        res.send({
            upSince : self.upSince,
            recordings : self.recordings,
            errors : self.errors,
            recordsToKeep : self.recordsToKeep,
            errorsToKeep : self.errorsToKeep
        });
    }
}

module.exports = MiniOps;
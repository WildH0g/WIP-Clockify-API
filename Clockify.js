// jshint esversion: 9
// jshint laxbreak: true

const Clockify = (function () {
  const _clokifyRequest = (path, parent) => {
    const headers = {
      'X-Api-Key': parent.apiKey,
      contentType: 'application/json',
    };

    const options = {
      headers: headers,
    };

    const response = UrlFetchApp.fetch(parent.url + path, options);
    return JSON.parse(response);
  };

  const _parseDuration = value => {
    //format PT1H30M15S
    const h = /\d+(?=H)/.exec(value);
    const m = /\d+(?=M)/.exec(value);
    const s = /\d+(?=S)/.exec(value);

    return `${h ? (h[0] < 10 ? '0' + h[0] : h[0]) : '00'}:${
      m ? (m[0] < 10 ? '0' + m[0] : m[0]) : '00'
    }:${s ? (s[0] < 10 ? '0' + s[0] : s[0]) : '00'}`;
  };

  class Clockify {
    constructor(options) {
      const { workspaceId, userId, apiKey } = options;
      // const workspaceId = '5f55d967ef178479ad7121df';
      // const userId = '5f55d967ef178479ad7121de';
      // this.apiKey = 'X1XZ2u8XhHmtcSc0';
      this.apiKey = apiKey;
      this.timeEntriesPath = `/workspaces/${workspaceId}/user/${userId}/time-entries`;
      this.projectsPath = `/workspaces/${workspaceId}/projects`;
      this.url = 'https://api.clockify.me/api/v1';

      this.projects = [['Id', 'Name', 'Duration', 'Comments']];
    }

    getProjects(raw = false) {
      this.raw = _clokifyRequest(this.projectsPath, this);
      this.raw.forEach(proj => {
        const { id, name, duration } = proj;
        this.projects.push([id, name, _parseDuration(duration), duration]);
      });
      return raw ? this.raw : this.projects;
    }

    getTimeEntries(raw = false) {
      const entries = _clokifyRequest(this.timeEntriesPath, this);
      if (raw) return entries;
      const headers = Object.keys(entries[0]);
      headers.splice(
        headers.findIndex(value => value === OPTIONS.TimeIntervalHeader),
        1,
        ...OPTIONS.TimeIntervalSubheaders
      );
      return entries.reduce(
        (acc, entry) => {
          return [
            ...acc,
            headers.map(header => {
              if (-1 === OPTIONS.TimeIntervalSubheaders.indexOf(header))
                return entry[header];
              const unparsedEntry = entry[OPTIONS.TimeIntervalHeader][header];
              return 'duration' === header
                ? _parseDuration(unparsedEntry)
                : unparsedEntry;
            }),
          ];
        },
        [[...headers]]
      );
    }
  }
  return Clockify;
})();

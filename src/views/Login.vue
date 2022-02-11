<template>
  <h1>login with meower to continue</h1>
  <form id="login" onsubmit="onsubmit">
    <input type="text" name="username" placeholder="username" />
    <input type="password" name="password" placeholder="password" />
    <br />
    <button type="submit" value="Login">Login</button>
  </form>
</template>
<script lang="ts">
  /*
    Typescript Types
  */
  type callback = (data: any[]) => any;

  type eventsObj = { [event: string]: callback[] };

  type outgoingPacket =
    | {
        cmd: string;
        val: any;
      }
    | {
        cmd: string;
        val: any;
        id: string;
      }
    | {
        cmd: string;
        val: any;
        name: string;
      }
    | {
        cmd: string;
        val: any;
        name: string;
        id: string;
      };
  interface looseObj {
    [key: string]: any;
  }

  class Cloudlink {
    events: eventsObj = {};
    ws: WebSocket;
    constructor(server: string) {
      this.ws = new WebSocket(server);
      this.ws.onopen = async () => {
        this.send({
          cmd: 'direct',
          val: {
            cmd: 'ip',
            val: await (await fetch('https://api.ipify.org/')).text(),
          },
        });
        this.send({
          cmd: 'direct',
          val: { cmd: 'type', val: 'js' },
        });
        this.emit('connected');
      };

      this.ws.onmessage = (socketdata: MessageEvent<any>) => {
        var data = JSON.parse(socketdata.data);
        this.emit(data.cmd, data);
      };

      this.ws.onclose = () => {
        this.emit('disconnected');
      };

      this.ws.onerror = (e) => {
        this.emit('error', e);
      };
    }
    send(data: outgoingPacket) {
      this.ws.send(JSON.stringify(data));
    }
    on(event: string, cb: callback) {
      if (typeof this.events[event] !== 'object') this.events[event] = [];
      this.events[event].push(cb);
    }
    emit(event: string, data?: any) {
      if (typeof this.events[event] !== 'object') return;

      this.events[event].forEach((cb) => cb(data));
    }

    disconnect() {
      this.ws.close();
    }
  }

  // form submit
  onsubmit = (e) => {
    // do stuff
    e.preventDefault();
    // get the form data
    let formData = new FormData(
      document.getElementById('login') as HTMLFormElement
    );
    // login with cljs
    let client = new Cloudlink('wss://server.meower.org');
    client.on('connected', () => {
      client.send({ cmd: 'direct', val: 'meower' });
      client.send({
        cmd: 'direct',
        val: {
          cmd: 'authpswd',
          val: {
            username: formData.get('username'),
            pswd: formData.get('password'),
          },
        },
      });
      client.on('ulist', async (data: looseObj) => {
        if (data.val.includes(formData.get('username'))) {
          let uuid = await (await fetch('https://uuid.rocks/plain')).text();
          client.send({
            cmd: 'pvar',
            val: uuid,
            name: 'f',
            id: 'authsvc',
          });
          setTimeout(() => {
            client.disconnect();
            window.location.assign(
              `https://api.openly.cf/accounts/token?token=${uuid}`
            );
          }, 1000);
        }
      });
    });
  };
  export default {
    name: 'Login',
  };
</script>

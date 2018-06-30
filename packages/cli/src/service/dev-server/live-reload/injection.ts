// language=HTML
export const LIVE_RELOAD_INJECTION = (websocketPath: string, websocketPort: number) => `
<!-- Code injected by Fovea's Development Server -->
<script type="text/javascript">
		(function() {
			if (!('WebSocket' in window)) return;
			var protocol = window.location.protocol === "http:" ? "ws://" : "wss://";
			var address = protocol + window.location.hostname + ":${websocketPort}" + window.location.pathname + "${websocketPath}";
			var socket = new WebSocket(address);
			socket.onmessage = function(msg) {
				if (msg.data == "reload") window.location.reload();
			};
		})();
</script>
`;
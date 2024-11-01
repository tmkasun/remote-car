class TLSServerSocketPool:
    def __init__(self, pool, ssl_context):
        self._pool = pool
        self._ssl_context = ssl_context
    SOL_SOCKET = 4095
    SO_REUSEADDR = 4
    @property
    def AF_INET(self):
        return self._pool.AF_INET

    @property
    def SOCK_STREAM(self):
        return self._pool.SOCK_STREAM

    def socket(self, *args, **kwargs):
        socket = self._pool.socket(*args, **kwargs)
        return self._ssl_context.wrap_socket(socket, server_side=True)

    def getaddrinfo(self, *args, **kwargs):
        return self._pool.getaddrinfo(*args, **kwargs)
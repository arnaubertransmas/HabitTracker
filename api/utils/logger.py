import logging

logging.basicConfig(
    #! guardem els errors a app.log
    filename="app.log",
    level=logging.ERROR,
    format="%(asctime)s - %(message)s",
)


def log_error(error):
    logging.error(error)

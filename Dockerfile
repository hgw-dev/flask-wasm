FROM emscripten/emsdk

RUN mkdir /app

COPY src /app/src
COPY build.sh /app/build.sh
COPY requirements.txt /app/requirements.txt

WORKDIR /app

RUN ./build.sh

COPY src /app/src
COPY view.py /app/view.py
COPY templates /app/templates

ENTRYPOINT [ "python3" ]

CMD ["view.py" ]
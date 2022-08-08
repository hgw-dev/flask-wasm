FROM emscripten/emsdk

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip3 install -r requirements.txt

COPY src/cpp /app/src/cpp
COPY build.sh /app/build.sh

RUN ./build.sh

COPY src/js static/js
COPY src/css static/css
COPY view.py /app/view.py
COPY templates /app/templates

ENTRYPOINT [ "python3" ]

CMD ["view.py" ]
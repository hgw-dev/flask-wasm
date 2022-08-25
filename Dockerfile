FROM emscripten/emsdk

WORKDIR /app

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY src src
COPY templates templates

COPY build.sh .
COPY view.py .
COPY entrypoint.sh .
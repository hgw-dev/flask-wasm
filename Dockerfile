FROM emscripten/emsdk

WORKDIR /app

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY src src
COPY build.sh .
RUN ./build.sh

COPY templates templates
COPY view.py .
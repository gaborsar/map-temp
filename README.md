Tested with:
 * `python 3`
 * `node 22`

Setup and start the backend:
```
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt
fastapi dev backend/main.py
```

Setup and start the frontend:
```
yarn
yarn start
```

## Answer to question 3

For 1 day we currently have 4510080 hmax values, or 129647 if we ignore the nan values.

From 1950 to today, that would be either 365 * 75 * 4510080 = 123463440000 (~123 billion),
or if we assume that every day has the same amount of non nan values, 365 * 75 * 129647 = 3549086625 (~4 billion) values.

We could put this data into a database, but with (4 - 100+) billion rows, that could be problematic.

Instead, I would process the data and create an aggregate file from it, with only the max hmax value for each coordinate, without the time dimension.

Processing the current file in this manner takes ~420 seconds on my machine.

Processing 365 * 75 files would take 11497500 seconds; that is ~133 days.

If we could parallelise and process 10 files at the same time, we could process the entire dataset in ~13 days.

Of course these are only estimates, and the real numbers can be very different.

The main concerns here are computing power and storage requirements.

I am not 100% sure about the best practical setup, but I think every major cloud provider offers some service that could be used for this, and I would definitely consult with an expert in the area first.

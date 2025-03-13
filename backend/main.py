import os
import xarray as xr
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, "waves_2019-01-01.nc")

@app.get("/api/hmax/{time}")
def get_daily_hmax(time: str, latitude: float, longitude: float):
    with xr.open_dataset(filename) as data:
        try:
            # it seems like the dataset only has coordinates that are divisible by 0.5...
            filtered_data = data.sel(time=time, latitude=round_to_half(latitude), longitude=round_to_half(longitude))
            hmax = filtered_data.hmax.values.max()
            if xr.ufuncs.isnan(hmax):
                return { "hmax": -1 }
            else:
                return { "hmax": hmax }
        except KeyError as e:
            return { "hmax": -1 }

def round_to_half(value: float) -> float:
    return round(value * 2) / 2

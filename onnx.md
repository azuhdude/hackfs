# SK Learn Regression or Feature Vector Model


```python
from sklearn.datasets import load_boston
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

boston_prices = load_boston()
boston_features = boston_prices['data']
boston_targets = boston_data['target']
boston_features_train, boston_features_test, boston_targets_train, boston_targets_test = train_test_split(boston_features, boston_targets)
```

### Boston Housing Prices Dataset

**Input features shape**: 13 cols 127 rows

Sample: [6.320e-03, 1.800e+01, 2.310e+00, 0.000e+00, 5.380e-01, 6.575e+00,
       6.520e+01, 4.090e+00, 1.000e+00, 2.960e+02, 1.530e+01, 3.969e+02,
       4.980e+00]


**Output targets shape**: 1 col 127 rows

Sample: 24.0

### Model Training and ONNX output


```python
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

regressor = RandomForestRegressor()
regressor.fit(boston_features_train,boston_targets_train)

model_input_shape_and_type = [('boston_price_features', FloatTensorType([None, 13]))]
model_output_shape_and_type = [('boston_price_target', FloatTensorType([None, 1]))]
sklearn_onnx_model = onx = convert_sklearn(regressor, initial_types=model_input_shape_and_type, final_types=model_output_shape_and_type)
with open('sklearn.onnx', 'wb') as write_file:
    write_file.write(sklearn_onnx_model.SerializeToString())
```

### Serialized Model Reading and ONNX runtime inference


```python
import onnxruntime as onnx_runtime
import numpy as np

inference_session = onnx_runtime.InferenceSession('sklearn.onnx')

# Run prediction

input_name = inference_session.get_inputs()[0].name
output_name = inference_session.get_outputs()[0].name

print(f'Input is named {input_name}')
print(f'Output is named {output_name}')

inference_session.run([output_name], {input_name: boston_features_test.astype(np.float32)})[0]

```

# Keras Image Classification Model


```python
import tensorflow as tf
from tensorflow import keras

fashion_mnist = keras.datasets.fashion_mnist
(fashion_features_train, fashion_targets_train), (fashion_features_test, fashion_targets_test) = fashion_mnist.load_data()
class_names = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
               'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot']

```

### Fashion MNIST Dataset

**Input features shape**: 28 cols 28 rows 60000 samples


**Output targets shape**: 1 col 60000 rows

Sample: 3 (targets are ints in the data set and then mapped to a string)

## Pre-processing:
Some data sets will require pre-processing and this will be at the discretion of the *model submitter* not the problem submitter and so the eval script 
will need to not only run the onnx model but also any pre-processing: probably a docker container is the best way for now ?


```python
fashion_features_train = fashion_features_train / 255.0

fashion_features_test = fashion_features_test / 255.0
```

### Model Training and ONNX output


```python
import onnxmltools

keras_model = keras.Sequential([
    keras.layers.Flatten(input_shape=(28, 28)),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(10),
    keras.layers.Softmax()
])

keras_model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

keras_model.fit(fashion_features_train, fashion_targets_train, epochs=10)

keras_onnx_model = onnxmltools.convert_keras(keras_model)
onnxmltools.utils.save_model(keras_onnx_model, 'keras_model.onnx')
```

### Serialized Model Reading and ONNX runtime inference


```python
import onnxruntime as onnx_runtime
import numpy as np

inference_session = onnx_runtime.InferenceSession('keras_model.onnx')

# Run prediction

input_name = inference_session.get_inputs()[0].name
output_name = inference_session.get_outputs()[0].name

print(f'Input is named {input_name}')
print(f'Output is named {output_name}')

inference_session.run([output_name], {input_name: fashion_features_test[0:20].astype(np.float32)})[0]
```

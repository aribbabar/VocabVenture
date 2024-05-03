# WordCraft

A user-friendly and immersive language learning platform that transforms the learning experience into an exciting adventure. By focusing on fun, interactivity, and personalization, we aim to make learning a language an enjoyable journey for users, motivating them to achieve their language learning goals with enthusiasm and delight.

## How to Run WordCraft Locally

Begin by cloning the WordCraft by running the following command:

```
git clone https://github.com/aribbabar/WordCraft.git
```

Ensure that you are in the project directory. If you are in a terminal session, you can use the following command:

```
cd WordCraft
```

Ensure that you have pip and python installed. We need to create a virtual enviroment to install the required dependencies. Create a new virtual enviroment by running the following command:

```
python -m venv venv
```

After we create a virtual envirioment, we need to activate it. Run the following command to activate the virtual enviroment:

```
venv/Scripts/activate # windows
source venv/Scripts/activate # linux/mac
```

We need to install the required dependencies after activating the virtual enviroment. Run the following command to install the required dependencies:

```
pip install -r app/requirements.txt
```

After installing the required dependencies, you can run the application locally using the following command:

```
flask run
```

# Address Management App

## Setup Instructions

1. Install dependencies:
```bash
npm i
```

2. Create environment configuration:
- Create a `.env` file in the root directory
- Add your API key following the format in `.env.example`

3. Launch the application:
```bash
npx expo start
```

4. Run on Android:
- Enter `a` in the terminal to launch the Android simulator

## Current Implementation Notes

### Address Storage
- Address data is currently logged to the console
- Can be extended to use local storage or database implementation
- UI for saved addresses pending

### Known Limitations
- Location permission popup functionality limited after two denials
- MapView uses basic marker implementation instead of custom text display

### Future Improvements
- Implement persistent address storage
- Enhance location permission handling
- Add custom map markers
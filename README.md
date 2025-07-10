# T.O.V.A. (Test of Variables of Attention) - HTML/JS Version

This is an HTML/JavaScript implementation of the T.O.V.A. test that precisely replicates the functionality and scientific validity of the original Inquisit version.

## Features

- ✅ **Exact Replication of Original Test**: Rebuilt based on the official Inquisit script
- ✅ **Fullscreen Mode**: Automatic fullscreen display during testing
- ✅ **High Precision Timing**: Low-latency response measurement using `performance.now()`
- ✅ **Spacebar Control**: Dual control with spacebar and GUI buttons
- ✅ **Data Export**: Automatic generation of raw data and summary CSV files
- ✅ **Scientific Statistics**: All original test statistical indicators (d-prime, z-scores, etc.)

## Test Structure

### Test Phases
1. **Practice Phase**: 50 trials (1:1 target/non-target ratio) - ~3 minutes
2. **Low Frequency Phase 1**: 162 trials (36 targets, 126 non-targets) - ~5.5 minutes  
3. **Low Frequency Phase 2**: 162 trials (36 targets, 126 non-targets) - ~5.5 minutes
4. **High Frequency Phase 1**: 162 trials (126 targets, 36 non-targets) - ~5.5 minutes
5. **High Frequency Phase 2**: 162 trials (126 targets, 36 non-targets) - ~5.5 minutes

**Total Test Time**: ~24 minutes

### Stimulus Characteristics
- **Target Stimulus**: Small black square at the top of white background square
- **Non-target Stimulus**: Small black square at the bottom of white background square
- **Stimulus Duration**: 100ms
- **Stimulus Interval**: 2000ms (SOA)

### Response Requirements
- **When Target Appears**: Press spacebar as quickly as possible
- **When Non-target Appears**: Do not respond
- **Minimum Valid Response Time**: 200ms (responses below this are considered anticipatory)

## Usage

### 1. Quick Start
```bash
# Open in browser
open index.html
# Or use local server
python -m http.server 8000
# Then visit http://localhost:8000
```

### 2. Test Flow
1. Open `index.html`
2. Enter subject information (name, group, session)
3. Read instructions and view example stimuli
4. Complete practice phase
5. Perform formal test (4 test blocks)
6. Download data files after test completion

### 3. Spacebar Control
- Use spacebar to advance at any interface
- Only spacebar responses are valid during testing
- Mouse clicking on GUI buttons is supported (optional)

## Data Output

### Raw Data (tova_raw_*.txt)
Contains detailed information for each trial:
- Response time, accuracy, stimulus type
- Anticipatory response, false alarm markers
- Post-commission hit response times

### Summary Data (tova_summary_*.txt)  
Contains statistical indicators:
- **Basic Indicators**: Hit rate, omission rate, false alarm rate
- **Response Time Statistics**: Mean, standard deviation
- **d-prime Analysis**: Signal detection theory indicators
- **z-scores**: Standardized scores
- **Block Statistics**: Independent analysis for each phase

## Technical Specifications

### Precision Timing
- Uses `performance.now()` for sub-millisecond precision
- Optimized event listeners to reduce latency
- Asynchronous processing ensures real-time response

### Data Integrity
- All statistical calculations exactly match the original Inquisit version
- z-score adjustments follow Gregg & Sedikides (2010) standards
- d-prime calculations use standard signal detection theory formulas

### Browser Compatibility
- Chrome (recommended)
- Firefox  
- Safari
- Edge

## File Structure
```
tova/
├── index.html          # Main test interface
├── style.css           # Stylesheet
├── tova.js             # Test logic
├── demo.html           # Demo and launch page
├── quick-test.html     # Quick test version for debugging
├── README_CN.md        # Chinese documentation
├── README.md           # English documentation
└── tova.iqx            # Original Inquisit script
```

## Scientific Validation

This implementation is based on the following scientific literature:

1. **Greenberg, L.M., & Waldman, I.D. (1993)**. Developmental normative data on the Test of Variable of Attention (T.O.V.A.™). *Journal of Child Psychology and Psychiatry*, 34, 1019–1030.

2. **Greenberg, L.M., Kindschi, C.L., Dupuy, T.R., Hughes, S.J. (2016)**. TOVA: Test of Variable Attention. Clinical Manual.

3. **Gregg, A. & Sedikides, C. (2010)**. Narcissistic Fragility: Rethinking Its Links to Explicit and Implicit Self-esteem. *Self and Identity*, 9:2, 142-161.

## Important Notes

1. **Environment Requirements**: Quiet testing environment, minimize distractions
2. **Hardware Requirements**: Responsive keyboard, stable computer performance
3. **Subject Preparation**: Ensure subjects understand task requirements
4. **Data Backup**: Save and backup test data promptly

## Troubleshooting

### Common Issues
- **Fullscreen Not Working**: Ensure browser supports fullscreen API
- **No Key Response**: Check if focus is on test window
- **Data Download Fails**: Check browser download permissions

### Performance Optimization
- Close other applications to ensure computer performance
- Use wired keyboard to reduce wireless latency
- Ensure browser is up to date

## License

This project is a reimplementation of the original T.O.V.A. Inquisit script for research and educational purposes only. Please comply with relevant intellectual property and usage terms.

## Technical Support

For technical issues or feature suggestions, please contact the development team.

## Quick Test Mode

For development and debugging, use `quick-test.html`:
- Shortened version (total ~2 minutes)
- Real-time debug panel
- Quick function verification
- Practice: 6 trials, Test blocks: 20 trials each

## Demo Mode

Use `demo.html` for:
- Test instructions and stimulus examples
- Understanding test requirements and precautions
- One-click launch of formal test

## Data Format Examples

### Raw Data Format
```
build	computer.platform	date	time	subject	group	session
blockcode	blocknum	trialcode	trialnum	frequency	response
correct	latency	anticipatoryResponse	commissionerror	postCommissionHit
```

### Summary Data Format
Contains comprehensive statistical analysis:
- Basic indicators (hit rate, false alarm rate, omission rate)
- Response time statistics (mean, standard deviation)
- Signal detection indicators (d-prime, z-scores)
- Block analysis (independent statistics for each phase)

## Research Applications

This T.O.V.A. implementation is suitable for:
- Attention Deficit Hyperactivity Disorder (ADHD) assessment
- Cognitive research studies
- Clinical applications
- Educational psychology research
- Neuroscience studies

All data output formats are consistent with the original Inquisit version, ensuring scientific validity of results. 
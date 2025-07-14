/**
 * T.O.V.A. (Test of Variables of Attention) - HTML/JS Implementation
 * Based on the original Inquisit script
 */

class TOVA {
    constructor() {
        // Test parameters (matching Inquisit)
        this.params = {
            SOA: 2000,                    // Stimulus Onset Asynchrony (ms)
            stimulusDuration: 100,        // Stimulus display duration (ms)
            minValidLatency: 200,         // Minimum valid response latency (ms)
            showPracticeFeedback: false   // Error feedback during practice
        };

        // Test state
        this.state = {
            currentPhase: 'welcome',      // welcome, instructions, practice, test, finish
            currentBlock: null,           // practice, lowFrequency1, lowFrequency2, hiFrequency1, hiFrequency2
            currentTrial: 0,
            blockTrials: [],
            trialInProgress: false,
            startTime: null,
            testStartTime: null
        };

        // Subject info
        this.subject = {
            name: '',
            group: 1,
            session: 1,
            startDate: '',
            startTime: ''
        };

        // Data arrays
        this.rawData = [];
        this.summaryData = {};

        // Timing variables
        this.stimulusStartTime = 0;
        this.responseTime = 0;
        this.currentTimeout = null;
        this.stimulusTimeout = null;

        // Performance tracking
        this.blockStats = {
            practice: { correct: [], anticipatory: 0 },
            lowFrequency1: { targetAcc: [], nontargetAcc: [], targetRT: [], anticipatory: 0 },
            lowFrequency2: { targetAcc: [], nontargetAcc: [], targetRT: [], anticipatory: 0 },
            hiFrequency1: { targetAcc: [], nontargetAcc: [], targetRT: [], anticipatory: 0 },
            hiFrequency2: { targetAcc: [], nontargetAcc: [], targetRT: [], anticipatory: 0 }
        };

        // Commission error tracking
        this.lastCommissionError = false;
        this.postCommissionHits = [];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('welcome');
        
        // Show subject dialog first
        this.showSubjectDialog();
    }

    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        // Button events
        document.getElementById('continue-btn').addEventListener('click', () => this.showInstructions());
        document.getElementById('view-samples-btn').addEventListener('click', () => this.showTargetSample());
        document.getElementById('next-sample-btn').addEventListener('click', () => this.showNonTargetSample());
        document.getElementById('start-practice-btn').addEventListener('click', () => this.startPractice());
        document.getElementById('start-test-btn').addEventListener('click', () => this.showPracticeFinished());
        document.getElementById('begin-tova-btn').addEventListener('click', () => this.startTest());
        document.getElementById('download-raw-btn').addEventListener('click', () => this.downloadRawData());
        document.getElementById('download-summary-btn').addEventListener('click', () => this.downloadSummaryData());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartTest());
        document.getElementById('return-btn').addEventListener('click', () => this.returnToMain());

        // Subject form
        document.getElementById('subject-form').addEventListener('submit', this.handleSubjectForm.bind(this));
        
        // Back to main button
        document.getElementById('back-to-main-btn').addEventListener('click', () => this.returnToMain());

        // Prevent context menu
        document.addEventListener('contextmenu', e => e.preventDefault());
    }

    enableFullscreen() {
        // Only enable fullscreen if not already in fullscreen
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.msFullscreenElement) {
            
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    showSubjectDialog() {
        document.getElementById('subject-dialog').style.display = 'flex';
    }

    hideSubjectDialog() {
        document.getElementById('subject-dialog').style.display = 'none';
    }

    handleSubjectForm(e) {
        e.preventDefault();
        this.subject.name = document.getElementById('subject-name').value;
        this.subject.group = parseInt(document.getElementById('group-id').value);
        this.subject.session = parseInt(document.getElementById('session-id').value);
        
        const now = new Date();
        this.subject.startDate = now.toISOString().split('T')[0];
        this.subject.startTime = now.toTimeString().split(' ')[0];
        this.state.testStartTime = performance.now();
        
        this.hideSubjectDialog();
        
        // Enable fullscreen after form submission
        this.enableFullscreen();
    }

    handleKeyDown(e) {
        if (e.code === 'Space') {
            // Disable space key on welcome screen to prevent conflicts with name input
            if (this.state.currentPhase === 'welcome') {
                return;
            }
            e.preventDefault();
            this.handleSpacePress();
        }
    }

    handleKeyUp(e) {
        // Handle key release if needed
    }

    handleSpacePress() {
        const currentTime = performance.now();

        switch (this.state.currentPhase) {
            case 'instructions':
                this.showTargetSample();
                break;
            case 'target-sample':
                this.showNonTargetSample();
                break;
            case 'nontarget-sample':
                this.startPractice();
                break;
            case 'practice-finished':
                this.startTest();
                break;
            case 'finish':
                // Space key no longer exits - use buttons instead
                break;
            case 'stimulus':
                if (this.state.trialInProgress) {
                    this.recordResponse(currentTime);
                }
                break;
        }
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(screenName + '-screen').classList.add('active');
        this.state.currentPhase = screenName;
    }

    showInstructions() {
        this.showScreen('instructions');
    }

    showTargetSample() {
        this.showScreen('target-sample');
    }

    showNonTargetSample() {
        this.showScreen('nontarget-sample');
    }

    showPracticeFinished() {
        this.showScreen('practice-finished');
    }

    startPractice() {
        this.state.currentPhase = 'practice';
        this.state.currentBlock = 'practice';
        this.state.currentTrial = 0;
        this.generateTrialSequence('practice');
        
        // Show transition screen for 2 seconds before starting
        this.showScreen('transition');
        setTimeout(() => {
            this.showStimulus();
        }, 2000);
    }

    startTest() {
        this.state.currentPhase = 'test';
        this.state.currentBlock = 'lowFrequency1';
        this.state.currentTrial = 0;
        this.generateTrialSequence('lowFrequency1');
        
        // Show transition screen for 2 seconds before starting
        this.showScreen('transition');
        setTimeout(() => {
            this.showStimulus();
        }, 2000);
    }

    generateTrialSequence(blockType) {
        const trials = [];

        switch (blockType) {
            case 'practice':
                // 50 trials, 1:1 ratio (25 targets, 25 non-targets)
                for (let i = 0; i < 25; i++) {
                    trials.push('target');
                    trials.push('nontarget');
                }
                break;

            case 'lowFrequency1':
            case 'lowFrequency2':
                // 162 trials, 36 targets, 126 non-targets (1:3.5 ratio)
                for (let i = 0; i < 36; i++) {
                    trials.push('target');
                }
                for (let i = 0; i < 126; i++) {
                    trials.push('nontarget');
                }
                break;

            case 'hiFrequency1':
            case 'hiFrequency2':
                // 162 trials, 126 targets, 36 non-targets (3.5:1 ratio)
                for (let i = 0; i < 126; i++) {
                    trials.push('target');
                }
                for (let i = 0; i < 36; i++) {
                    trials.push('nontarget');
                }
                break;
        }

        // Shuffle trials randomly
        for (let i = trials.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [trials[i], trials[j]] = [trials[j], trials[i]];
        }

        this.state.blockTrials = trials;
    }

    showStimulus() {
        if (this.state.currentTrial >= this.state.blockTrials.length) {
            this.endBlock();
            return;
        }

        const isTarget = this.state.blockTrials[this.state.currentTrial] === 'target';
        
        this.showScreen('stimulus');
        this.state.trialInProgress = true;
        this.stimulusStartTime = performance.now();
        this.responseTime = null;
        this.lastCommissionError = false;

        // Show background square and target
        const backgroundSquare = document.getElementById('background-square');
        const targetSquare = document.getElementById('target-square');
        
        backgroundSquare.style.display = 'block';
        targetSquare.className = isTarget ? 'target' : 'nontarget';

        // Hide stimulus after duration
        this.stimulusTimeout = setTimeout(() => {
            backgroundSquare.style.display = 'none';
        }, this.params.stimulusDuration);

        // End trial after SOA
        this.currentTimeout = setTimeout(() => {
            this.endTrial();
        }, this.params.SOA);
    }

    recordResponse(responseTime) {
        if (this.responseTime === null) { // Only record first response
            this.responseTime = responseTime;
        }
    }

    endTrial() {
        clearTimeout(this.currentTimeout);
        clearTimeout(this.stimulusTimeout);
        
        const isTarget = this.state.blockTrials[this.state.currentTrial] === 'target';
        const latency = this.responseTime ? (this.responseTime - this.stimulusStartTime) : this.params.SOA;
        const responded = this.responseTime !== null;
        
        // Determine correctness
        let correct = false;
        if (isTarget && responded) {
            correct = true;
        } else if (!isTarget && !responded) {
            correct = true;
        }

        // Check for anticipatory response
        const anticipatory = responded && latency < this.params.minValidLatency;

        // Check for commission error (false alarm, excluding anticipatory)
        let commissionError = false;
        if (!isTarget && responded && !anticipatory) {
            commissionError = true;
            this.lastCommissionError = true;
        }

        // Check for post-commission hit
        let postCommissionHit = false;
        if (isTarget && correct && !anticipatory && this.lastCommissionError) {
            postCommissionHit = true;
            this.postCommissionHits.push(latency);
            this.lastCommissionError = false;
        }

        // Record raw data
        const trialData = {
            build: '1.0.0',
            platform: navigator.platform,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().split(' ')[0],
            subject: this.subject.name,
            group: this.subject.group,
            session: this.subject.session,
            blockcode: this.state.currentBlock,
            blocknum: this.getBlockNumber(),
            trialcode: isTarget ? 'target' : 'nonTarget',
            trialnum: this.state.currentTrial + 1,
            frequency: this.getFrequencyCode(),
            response: responded ? 57 : 0, // 57 = spacebar scancode
            correct: correct ? 1 : 0,
            latency: Math.round(latency),
            anticipatoryResponse: anticipatory ? 1 : 0,
            commissionerror: commissionError ? 1 : 0,
            postCommissionHit: postCommissionHit ? 1 : 0
        };

        this.rawData.push(trialData);

        // Update block statistics (exclude anticipatory responses)
        if (!anticipatory) {
            this.updateBlockStats(isTarget, correct, latency, responded);
        } else {
            this.blockStats[this.state.currentBlock].anticipatory++;
        }

        // Show error feedback if enabled
        if (this.params.showPracticeFeedback && this.state.currentBlock === 'practice' && !correct) {
            this.showErrorFeedback();
        }

        this.state.trialInProgress = false;
        this.state.currentTrial++;

        // Continue to next trial or end block
        setTimeout(() => {
            this.showStimulus();
        }, 100);
    }

    updateBlockStats(isTarget, correct, latency, responded) {
        const stats = this.blockStats[this.state.currentBlock];

        if (this.state.currentBlock === 'practice') {
            stats.correct.push(correct);
        } else {
            if (isTarget) {
                stats.targetAcc.push(correct);
                if (correct) {
                    stats.targetRT.push(latency);
                }
            } else {
                stats.nontargetAcc.push(correct);
            }
        }
    }

    showErrorFeedback() {
        const errorFeedback = document.getElementById('error-feedback');
        errorFeedback.style.display = 'block';
        setTimeout(() => {
            errorFeedback.style.display = 'none';
        }, 100);
    }

    endBlock() {
        switch (this.state.currentBlock) {
            case 'practice':
                this.showPracticeFinished();
                break;
            case 'lowFrequency1':
                this.startNextBlock('lowFrequency2');
                break;
            case 'lowFrequency2':
                this.startNextBlock('hiFrequency1');
                break;
            case 'hiFrequency1':
                this.startNextBlock('hiFrequency2');
                break;
            case 'hiFrequency2':
                this.finishTest();
                break;
        }
    }

    startNextBlock(blockName) {
        this.state.currentBlock = blockName;
        this.state.currentTrial = 0;
        this.generateTrialSequence(blockName);
        // Small break between blocks
        setTimeout(() => {
            this.showStimulus();
        }, 1000);
    }

    finishTest() {
        this.calculateSummaryData();
        this.showScreen('finish');
    }

    getBlockNumber() {
        const blockMap = {
            'practice': 2,
            'lowFrequency1': 3,
            'lowFrequency2': 4,
            'hiFrequency1': 5,
            'hiFrequency2': 6
        };
        return blockMap[this.state.currentBlock] || 1;
    }

    getFrequencyCode() {
        if (this.state.currentBlock === 'practice') return 0;
        if (this.state.currentBlock.includes('lowFrequency')) return 1;
        if (this.state.currentBlock.includes('hiFrequency')) return 2;
        return 0;
    }

    calculateSummaryData() {
        // Combine all test data (excluding practice)
        const testBlocks = ['lowFrequency1', 'lowFrequency2', 'hiFrequency1', 'hiFrequency2'];
        
        // Overall statistics
        let allTargetAcc = [];
        let allNontargetAcc = [];
        let allTargetRT = [];
        let totalAnticipatory = 0;

        // Low frequency statistics
        let lfTargetAcc = [];
        let lfNontargetAcc = [];
        let lfTargetRT = [];

        // High frequency statistics
        let hfTargetAcc = [];
        let hfNontargetAcc = [];
        let hfTargetRT = [];

        testBlocks.forEach(block => {
            const stats = this.blockStats[block];
            
            allTargetAcc = allTargetAcc.concat(stats.targetAcc);
            allNontargetAcc = allNontargetAcc.concat(stats.nontargetAcc);
            allTargetRT = allTargetRT.concat(stats.targetRT);
            totalAnticipatory += stats.anticipatory;

            if (block.includes('lowFrequency')) {
                lfTargetAcc = lfTargetAcc.concat(stats.targetAcc);
                lfNontargetAcc = lfNontargetAcc.concat(stats.nontargetAcc);
                lfTargetRT = lfTargetRT.concat(stats.targetRT);
            } else {
                hfTargetAcc = hfTargetAcc.concat(stats.targetAcc);
                hfNontargetAcc = hfNontargetAcc.concat(stats.nontargetAcc);
                hfTargetRT = hfTargetRT.concat(stats.targetRT);
            }
        });

        // Get browser platform information
        const getBrowserPlatform = () => {
            const userAgent = navigator.userAgent;
            if (userAgent.includes('Chrome')) return 'chrome';
            if (userAgent.includes('Firefox')) return 'firefox';
            if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'safari';
            if (userAgent.includes('Edge')) return 'edge';
            if (userAgent.includes('Opera')) return 'opera';
            return 'unknown';
        };

        // Calculate statistics with exact column names matching summary file format
        this.summaryData = {
            'inquisit.version': '6.6.1', // Match the version format from sample
            'computer.platform': getBrowserPlatform(), // Use browser platform instead of OS platform
            'startDate': this.subject.startDate,
            'startTime': this.subject.startTime,
            'subjectId': this.subject.name,
            'groupId': this.subject.group,
            'sessionId': this.subject.session,
            'elapsedTime': Math.round(performance.now() - this.state.testStartTime),
            'completed': 1,
            'minValidLatency': this.params.minValidLatency,
            'sum_anticipatoryResponses': totalAnticipatory,
            'percentAnticipatoryResponses': (totalAnticipatory / this.rawData.filter(d => d.frequency > 0).length * 100),

            // Practice
            'propcorrect_practice': this.mean(this.blockStats.practice.correct),

            // Overall
            'overallproportioncorrect': this.mean(allTargetAcc.concat(allNontargetAcc)),
            'meanPostCommissionRT': this.mean(this.postCommissionHits),
            'meanHitRT': this.mean(allTargetRT),
            'SDHitRT': this.standardDeviation(allTargetRT),
            'hitRate': this.mean(allTargetAcc),
            'omissionsRate': 1 - this.mean(allTargetAcc),
            'commissionRate': 1 - this.mean(allNontargetAcc),

            // Low frequency
            'meanHitRT_LF': this.mean(lfTargetRT),
            'SDHitRT_LF': this.standardDeviation(lfTargetRT),
            'hitRate_LF': this.mean(lfTargetAcc),
            'omissionsRate_LF': 1 - this.mean(lfTargetAcc),
            'commissionRate_LF': 1 - this.mean(lfNontargetAcc),

            // High frequency
            'meanHitRT_HF': this.mean(hfTargetRT),
            'SDHitRT_HF': this.standardDeviation(hfTargetRT),
            'hitRate_HF': this.mean(hfTargetAcc),
            'omissionsRate_HF': 1 - this.mean(hfTargetAcc),
            'commissionRate_HF': 1 - this.mean(hfNontargetAcc),

            // Individual blocks
            ...this.calculateIndividualBlockStats()
        };

        // Calculate z-scores and d-prime
        this.calculateZScoresAndDPrime();
    }

    calculateIndividualBlockStats() {
        const blocks = ['lowFrequency1', 'lowFrequency2', 'hiFrequency1', 'hiFrequency2'];
        const stats = {};

        blocks.forEach(block => {
            const blockStats = this.blockStats[block];
            const suffix = block.replace('lowFrequency', 'LF').replace('hiFrequency', 'HF');

            stats[`meanHitRT_${suffix}`] = this.mean(blockStats.targetRT);
            stats[`SDHitRT_${suffix}`] = this.standardDeviation(blockStats.targetRT);
            stats[`hitRate_${suffix}`] = this.mean(blockStats.targetAcc);
            stats[`omissionsRate_${suffix}`] = 1 - this.mean(blockStats.targetAcc);
            stats[`commissionRate_${suffix}`] = 1 - this.mean(blockStats.nontargetAcc);
        });

        return stats;
    }

    calculateZScoresAndDPrime() {
        // Adjust hit rates and false alarm rates according to Gregg & Sedikides (2010)
        const adjustRate = (rate) => {
            if (rate === 0 || isNaN(rate)) return 0.005;
            if (rate === 1) return 0.995;
            return rate;
        };

        // Debug logging
        console.log('Calculating z-scores with hit rates and commission rates:');
        console.log('Overall hit rate:', this.summaryData.hitRate);
        console.log('Overall commission rate:', this.summaryData.commissionRate);

        // Overall
        const hitRate = adjustRate(this.summaryData['hitRate']);
        const faRate = adjustRate(this.summaryData['commissionRate']);
        console.log('Adjusted overall hit rate:', hitRate);
        console.log('Adjusted overall commission rate:', faRate);
        
        this.summaryData['z_hr'] = this.normalInverse(hitRate);
        this.summaryData['z_FAr'] = this.normalInverse(faRate);
        this.summaryData['dprime'] = this.summaryData['z_hr'] - this.summaryData['z_FAr'];

        // Low frequency
        const hitRate_LF = adjustRate(this.summaryData['hitRate_LF']);
        const faRate_LF = adjustRate(this.summaryData['commissionRate_LF']);
        this.summaryData['z_hr_LF'] = this.normalInverse(hitRate_LF);
        this.summaryData['z_FAr_LF'] = this.normalInverse(faRate_LF);
        this.summaryData['dprime_LF'] = this.summaryData['z_hr_LF'] - this.summaryData['z_FAr_LF'];

        // High frequency
        const hitRate_HF = adjustRate(this.summaryData['hitRate_HF']);
        const faRate_HF = adjustRate(this.summaryData['commissionRate_HF']);
        this.summaryData['z_hr_HF'] = this.normalInverse(hitRate_HF);
        this.summaryData['z_FAr_HF'] = this.normalInverse(faRate_HF);
        this.summaryData['dprime_HF'] = this.summaryData['z_hr_HF'] - this.summaryData['z_FAr_HF'];

        // Individual blocks
        ['LF1', 'LF2', 'HF1', 'HF2'].forEach(suffix => {
            const hr = adjustRate(this.summaryData[`hitRate_${suffix}`]);
            const far = adjustRate(this.summaryData[`commissionRate_${suffix}`]);
            this.summaryData[`z_hr_${suffix}`] = this.normalInverse(hr);
            this.summaryData[`z_FAr_${suffix}`] = this.normalInverse(far);
            this.summaryData[`dprime_${suffix}`] = this.summaryData[`z_hr_${suffix}`] - this.summaryData[`z_FAr_${suffix}`];
        });

        console.log('Final z-scores:', {
            z_hr: this.summaryData['z_hr'],
            z_FAr: this.summaryData['z_FAr'],
            dprime: this.summaryData['dprime']
        });
    }

    // Statistical utility functions
    mean(arr) {
        if (!arr || arr.length === 0) return 0;
        const validValues = arr.filter(val => !isNaN(val) && val !== null && val !== undefined);
        if (validValues.length === 0) return 0;
        return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
    }

    standardDeviation(arr) {
        if (!arr || arr.length === 0) return 0;
        const validValues = arr.filter(val => !isNaN(val) && val !== null && val !== undefined);
        if (validValues.length === 0) return 0;
        const mean = this.mean(validValues);
        const variance = validValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / validValues.length;
        return Math.sqrt(variance);
    }

    normalInverse(p) {
        // Robust approximation of the inverse normal CDF (z-score from probability)
        // Using Peter John Acklam's algorithm
        
        // Ensure p is in valid range
        if (isNaN(p) || p <= 0 || p >= 1) {
            console.warn(`Invalid probability for normalInverse: ${p}`);
            return 0;
        }

        // Coefficients for the rational approximation
        const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 
                   1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
        const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
                   6.680131188771972e+01, -1.328068155288572e+01];
        const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
                   -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
        const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
                   3.754408661907416e+00];

        // Define break-points
        const pLow = 0.02425;
        const pHigh = 1 - pLow;

        let result;

        if (p < pLow) {
            // Rational approximation for lower region
            const q = Math.sqrt(-2 * Math.log(p));
            result = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                     ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
        } else if (p <= pHigh) {
            // Rational approximation for central region
        const q = p - 0.5;
            const r = q * q;
            result = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
                     (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
        } else {
            // Rational approximation for upper region
            const q = Math.sqrt(-2 * Math.log(1 - p));
            result = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
        }

        return result;
    }

    // Data export functions
    downloadRawData() {
        const headers = [
            'build', 'computer.platform', 'date', 'time', 'subject', 'group', 'session',
            'blockcode', 'blocknum', 'trialcode', 'trialnum', 'frequency', 'response',
            'correct', 'latency', 'anticipatoryResponse', 'commissionerror', 'postCommissionHit'
        ];

        const csv = [headers.join(',')];
        this.rawData.forEach(row => {
            const line = headers.map(header => row[header] || '').join(',');
            csv.push(line);
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `tova_raw_${this.subject.name}_${timestamp}.csv`;
        this.downloadFile(csv.join('\n'), filename, 'text/csv');
    }

    downloadSummaryData() {
        // Define the exact column order to match the summary file format
        const columnOrder = [
            'inquisit.version', 'computer.platform', 'startDate', 'startTime', 'subjectId', 'groupId', 'sessionId', 'elapsedTime', 'completed', 'minValidLatency', 'sum_anticipatoryResponses', 'percentAnticipatoryResponses', 'propcorrect_practice', 'overallproportioncorrect', 'meanPostCommissionRT', 'meanHitRT', 'SDHitRT', 'hitRate', 'omissionsRate', 'commissionRate', 'z_hr', 'z_FAr', 'dprime', 'meanHitRT_LF', 'SDHitRT_LF', 'hitRate_LF', 'omissionsRate_LF', 'commissionRate_LF', 'z_hr_LF', 'z_FAr_LF', 'dprime_LF', 'meanHitRT_HF', 'SDHitRT_HF', 'hitRate_HF', 'omissionsRate_HF', 'commissionRate_HF', 'z_hr_HF', 'z_FAr_HF', 'dprime_HF', 'meanHitRT_LF1', 'SDHitRT_LF1', 'hitRate_LF1', 'omissionsRate_LF1', 'commissionRate_LF1', 'z_hr_LF1', 'z_FAr_LF1', 'dprime_LF1', 'meanHitRT_LF2', 'SDHitRT_LF2', 'hitRate_LF2', 'omissionsRate_LF2', 'commissionRate_LF2', 'z_hr_LF2', 'z_FAr_LF2', 'dprime_LF2', 'meanHitRT_HF1', 'SDHitRT_HF1', 'hitRate_HF1', 'omissionsRate_HF1', 'commissionRate_HF1', 'z_hr_HF1', 'z_FAr_HF1', 'dprime_HF1', 'meanHitRT_HF2', 'SDHitRT_HF2', 'hitRate_HF2', 'omissionsRate_HF2', 'commissionRate_HF2', 'z_hr_HF2', 'z_FAr_HF2', 'dprime_HF2'
        ];

        const headers = columnOrder;
        const values = columnOrder.map(key => this.summaryData[key] || '');

        const csv = [headers.join(','), values.join(',')];

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `tova_summary_${this.subject.name}_${timestamp}.csv`;
        this.downloadFile(csv.join('\n'), filename, 'text/csv');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    restartTest() {
        if (confirm('Are you sure you want to start a new test? All current data will be cleared.')) {
            location.reload();
        }
    }

    returnToMain() {
        if (confirm('Are you sure you want to return to the main page? All current data will be cleared.')) {
            window.location.href = 'index.html';
        }
    }
}

// Initialize the test when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.tova = new TOVA();
});
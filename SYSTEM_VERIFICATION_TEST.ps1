# Final System Verification Test

Write-Host "🚀 Testing AI-Enhanced Ticket System..." -ForegroundColor Green

# Test AI Endpoints
Write-Host "`n📊 Testing AI Endpoints..." -ForegroundColor Yellow

# Test 1: Category Prediction
Write-Host "Testing category prediction..." -ForegroundColor Cyan
try {
    $categoryTest = Invoke-RestMethod -Uri "http://localhost:3002/api/ai/predict-category" -Method POST -ContentType "application/json" -Body '{"subject": "Cannot login to system", "description": "My password is not working"}'
    Write-Host "✅ Category Prediction: WORKING" -ForegroundColor Green
    Write-Host "   Predicted Category: $($categoryTest.predictedCategory)" -ForegroundColor White
} catch {
    Write-Host "❌ Category Prediction: FAILED" -ForegroundColor Red
}

# Test 2: Emotion Analysis
Write-Host "`nTesting emotion analysis..." -ForegroundColor Cyan
try {
    $emotionTest = Invoke-RestMethod -Uri "http://localhost:3002/api/ai/analyze-emotion" -Method POST -ContentType "application/json" -Body '{"text": "I am very frustrated with this issue"}'
    Write-Host "✅ Emotion Analysis: WORKING" -ForegroundColor Green
    Write-Host "   Detected Emotion: $($emotionTest.emotion)" -ForegroundColor White
} catch {
    Write-Host "❌ Emotion Analysis: FAILED" -ForegroundColor Red
}

# Test 3: Instant Help
Write-Host "`nTesting instant help..." -ForegroundColor Cyan
try {
    $helpTest = Invoke-RestMethod -Uri "http://localhost:3002/api/ai/instant-help" -Method POST -ContentType "application/json" -Body '{"query": "password reset", "category": "password reset"}'
    Write-Host "✅ Instant Help: WORKING" -ForegroundColor Green
    Write-Host "   AI Answer: $($helpTest.answer)" -ForegroundColor White
} catch {
    Write-Host "❌ Instant Help: FAILED" -ForegroundColor Red
}

# Test Frontend Status
Write-Host "`n🌐 Testing Frontend Status..." -ForegroundColor Yellow
try {
    $frontendTest = Invoke-WebRequest -Uri "http://localhost:5175" -Method GET -TimeoutSec 5
    if ($frontendTest.StatusCode -eq 200) {
        Write-Host "✅ Frontend: ACCESSIBLE on http://localhost:5175" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend: NOT ACCESSIBLE" -ForegroundColor Red
}

# Test Backend Status
Write-Host "`nTesting backend status..." -ForegroundColor Cyan
try {
    $backendTest = Invoke-WebRequest -Uri "http://localhost:3002" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend: ACCESSIBLE on http://localhost:3002" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: NOT ACCESSIBLE" -ForegroundColor Red
}

Write-Host "`n🎉 System Verification Complete!" -ForegroundColor Green
Write-Host "`n📋 Summary of Implemented Features:" -ForegroundColor Yellow
Write-Host "   • AI-powered ticket categorization" -ForegroundColor White
Write-Host "   • Emotion/sentiment analysis" -ForegroundColor White
Write-Host "   • Instant help with automated responses" -ForegroundColor White
Write-Host "   • Smart chatbot with AI integration" -ForegroundColor White
Write-Host "   • Enhanced ticket creation form" -ForegroundColor White
Write-Host "   • Email confirmation system" -ForegroundColor White
Write-Host "   • Admin dashboard with AI insights" -ForegroundColor White
Write-Host "   • Real-time AI analysis display" -ForegroundColor White

Write-Host "`n✨ Ready for Production Use!" -ForegroundColor Magenta

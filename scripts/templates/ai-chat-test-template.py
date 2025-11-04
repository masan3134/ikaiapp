#!/usr/bin/env python3
"""
AI Chat Test Template
Test AI chat functionality, context management, response quality

Usage:
  cp scripts/templates/ai-chat-test-template.py scripts/tests/w4-ai-chat.py
  python3 scripts/tests/w4-ai-chat.py > test-outputs/w4-chat-output.txt
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from test_helper import IKAITestHelper, TEST_USERS
import time

def ask_question(helper, analysis_id, question):
    """Send a chat message and get response"""
    print(f"\n   User: {question}")

    start = time.time()
    response = helper.post(
        f'/api/v1/analysis-chat/{analysis_id}/chat',
        {"message": question}
    )
    end = time.time()

    response_time = (end - start) * 1000  # ms

    print(f"   AI: {response['response'][:150]}...")
    print(f"   Response time: {response_time:.0f}ms")

    return response, response_time

def main():
    helper = IKAITestHelper()

    print("=" * 60)
    print("AI CHAT TEST: Chat Functionality & Response Quality")
    print("=" * 60)

    # Step 1: Login
    print("\n📋 Step 1: Login")
    helper.login(TEST_USERS["org1_hr"]["email"], TEST_USERS["org1_hr"]["password"])
    print("✅ Logged in")

    # Step 2: Get or create analysis
    print("\n📋 Step 2: Get analysis for chat")
    analyses = helper.get("/api/v1/analyses")

    if len(analyses) == 0:
        print("⚠️ No analyses found. Upload a CV first!")
        print("   Run: python3 scripts/tests/workflow-test.py")
        return

    analysis = analyses[0]
    analysis_id = analysis['id']
    print(f"✅ Using analysis: {analysis_id[:8]}...")
    print(f"   Candidate: {analysis.get('candidate', {}).get('name', 'Unknown')}")

    # Step 3: Basic questions
    print("\n📋 Step 3: Basic chat questions")

    questions = [
        "Bu adayın en güçlü yönleri neler?",
        "TypeScript deneyimi ne kadar?",
        "Hangi şirketlerde çalışmış?",
        "Eğitim durumu nedir?",
        "Neden bu pozisyon için uygun?"
    ]

    response_times = []

    for i, question in enumerate(questions, 1):
        print(f"\n--- Question {i} ---")
        response, resp_time = ask_question(helper, analysis_id, question)
        response_times.append(resp_time)

    # Step 4: Follow-up question (context test)
    print("\n📋 Step 4: Follow-up question (context test)")
    print("\n--- Context Test ---")
    followup, _ = ask_question(
        helper,
        analysis_id,
        "İlk sorumda ne sormuştum?"
    )

    # Step 5: Comparison question
    print("\n📋 Step 5: Comparison question")
    print("\n--- Comparison Test ---")
    comparison, _ = ask_question(
        helper,
        analysis_id,
        "Bu adayı diğer adaylarla karşılaştır. En iyi 3 aday kimler?"
    )

    # Step 6: Get chat history
    print("\n📋 Step 6: Get chat history")
    history = helper.get(f'/api/v1/analysis-chat/{analysis_id}/history')
    print(f"✅ Chat history: {len(history)} messages")

    # Performance summary
    print("\n" + "=" * 60)
    print("PERFORMANCE SUMMARY")
    print("=" * 60)

    avg_time = sum(response_times) / len(response_times)
    max_time = max(response_times)
    min_time = min(response_times)

    print(f"\nResponse Times:")
    print(f"  Average: {avg_time:.0f}ms")
    print(f"  Min: {min_time:.0f}ms")
    print(f"  Max: {max_time:.0f}ms")

    if avg_time < 3000:
        print(f"\n✅ Performance: EXCELLENT (avg < 3s)")
    elif avg_time < 5000:
        print(f"\n🟡 Performance: GOOD (avg < 5s)")
    else:
        print(f"\n⚠️ Performance: SLOW (avg > 5s)")

    # Quality summary
    print("\n" + "=" * 60)
    print("QUALITY SUMMARY")
    print("=" * 60)

    print(f"\n✅ Chat Messages Sent: {len(questions) + 2}")
    print(f"✅ Chat History Stored: {len(history)} messages")
    print(f"✅ Context Working: {
'Yes' if 'ilk soru' in followup['response'].lower() else 'Unknown'}")

    print("\n📝 Manual Quality Review Needed:")
    print("  - Are responses in Turkish? [Y/N]")
    print("  - Are responses relevant to CV? [Y/N]")
    print("  - Are responses detailed (not generic)? [Y/N]")
    print("  - No hallucinations (fake info)? [Y/N]")

    print("\n" + "=" * 60)
    print("AI CHAT TEST COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    main()
